"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import type * as T from "three";

type Mood = "idle" | "listening" | "thinking" | "working" | "happy" | "sad" | "sleeping" | "hello";

// Bestie, a satin jelly drawn in WebGL. One renderer draws every mascot on the page and
// copies each frame into that mascot's own 2D canvas, so any number costs one GL context.

type Three = typeof import("three");
type Pose = "hover" | Mood;
type FacePart =
  | "eyeRound"
  | "eyeHappy"
  | "eyeClosed"
  | "smile"
  | "o"
  | "open"
  | "flat"
  | "frown"
  | "cheeks"
  | "brows";
type Face = Partial<Record<FacePart, number>>;
type PoseTarget = {
  amp: number;
  spd: number;
  wave: number;
  follow: number;
  eyeS: number;
  fade: number;
  look?: [number, number];
  face: Face;
};

const PARTS: FacePart[] = ["eyeRound", "eyeHappy", "eyeClosed", "smile", "o", "open", "flat", "frown", "cheeks", "brows"];

const POSES: Record<Pose, PoseTarget> = {
  idle: { amp: 0.03, spd: 1, wave: 0, follow: 1, eyeS: 1, fade: 0, face: { eyeRound: 1, smile: 1, cheeks: 1 } },
  hover: { amp: 0.03, spd: 1.3, wave: 0, follow: 1.6, eyeS: 1.15, fade: 0, face: { eyeRound: 1, smile: 1, cheeks: 1.15 } },
  listening: { amp: 0.025, spd: 1.2, wave: 0, follow: 1.35, eyeS: 1.14, fade: 0, face: { eyeRound: 1, smile: 1, cheeks: 1 } },
  thinking: { amp: 0.03, spd: 0.8, wave: 0.035, follow: 0.3, eyeS: 1, fade: 0, look: [0.03, 0.035], face: { eyeRound: 1, o: 1 } },
  working: { amp: 0.05, spd: 3, wave: 0, follow: 0.4, eyeS: 0.62, fade: 0, face: { eyeRound: 1, flat: 1 } },
  happy: { amp: 0.035, spd: 1.5, wave: 0, follow: 0.6, eyeS: 1, fade: 0, face: { eyeHappy: 1, open: 1, cheeks: 1.15 } },
  sad: { amp: 0.015, spd: 0.5, wave: 0, follow: 0.4, eyeS: 0.86, fade: 1, look: [0, -0.03], face: { eyeRound: 1, frown: 1, brows: 1 } },
  sleeping: { amp: 0.01, spd: 0.5, wave: 0, follow: 0, eyeS: 1, fade: 0, face: { eyeClosed: 1, cheeks: 0.7 } },
  hello: { amp: 0.03, spd: 1.4, wave: 0, follow: 0.8, eyeS: 1.05, fade: 0, face: { eyeHappy: 1, smile: 1, cheeks: 1 } },
};

const REACTIONS = ["boing", "jiggle", "hop", "spin", "surprise", "giggle", "stretch"] as const;
type Reaction = (typeof REACTIONS)[number];

// The canvas is this much larger than the mascot's box, so a jump can leave it
const JELLY_BLEED = 1.6;
// Idle this long without the pointer moving and Bestie falls asleep
const SLEEP_MS = 60_000;
const HELLO_S = 1.8;
const ORANGE = 0xff7322;

const ease = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x));

type Motion = { x: number; y: number; rx: number; ry: number; rz: number; sx: number; sy: number };

function motion(pose: Pose, t: number): Motion {
  const m: Motion = { x: 0, y: 0, rx: 0, ry: 0, rz: 0, sx: 1, sy: 1 };
  if (pose === "idle") {
    const b = Math.sin(t * 2);
    m.y = Math.sin(t * 1.2) * 0.02;
    m.sx = 1 + b * 0.012;
    m.sy = 1 - b * 0.012;
  } else if (pose === "hover") {
    m.y = 0.04 + Math.sin(t * 3) * 0.015;
    m.sy = 1.03;
    m.sx = 0.985;
  } else if (pose === "listening") {
    const n = Math.max(0, Math.sin(t * 3.2));
    m.rx = n * n * 0.12;
    m.y = 0.02;
    m.sy = 1.02;
  } else if (pose === "thinking") {
    m.rz = Math.sin(t * 0.8) * 0.09;
    m.ry = Math.sin(t * 0.5) * 0.12;
    m.y = Math.sin(t * 1.6) * 0.015;
  } else if (pose === "working") {
    const k = Math.abs(Math.sin(t * 5));
    m.sy = 1 - 0.07 * k;
    m.sx = 1 + 0.055 * k;
    m.y = -0.035 * k;
    m.rz = Math.sin(t * 2.5) * 0.03;
  } else if (pose === "happy") {
    const p = (t % 2.4) / 2.4;
    if (p < 0.12) {
      const k = ease(p / 0.12);
      m.sy = 1 - 0.14 * k;
      m.sx = 1 + 0.1 * k;
      m.y = -0.07 * k;
    } else if (p < 0.52) {
      const k = (p - 0.12) / 0.4;
      const h = Math.sin(k * Math.PI);
      m.y = h * 0.5;
      m.sy = 1 + 0.08 * h;
      m.sx = 1 - 0.05 * h;
      m.ry = ease(k) * Math.PI * 2;
    } else if (p < 0.7) {
      const k = (p - 0.52) / 0.18;
      const s = Math.sin(k * Math.PI) * (1 - k * 0.4);
      m.sy = 1 - 0.16 * s;
      m.sx = 1 + 0.12 * s;
      m.y = -0.08 * s;
    }
  } else if (pose === "sad") {
    m.sy = 0.9;
    m.sx = 1.07;
    m.y = -0.07;
    m.rz = 0.13 + Math.sin(t * 0.7) * 0.02;
    m.rx = 0.08;
  } else if (pose === "sleeping") {
    const b = Math.sin(t * 0.9);
    m.sy = 1 + b * 0.035;
    m.sx = 1 - b * 0.02;
    m.y = b * 0.01;
    m.rz = 0.06;
  } else if (pose === "hello") {
    m.rz = Math.sin(t * 5.5) * 0.16;
    m.y = Math.abs(Math.sin(t * 5.5)) * 0.05;
  }
  return m;
}

type Engine = { THREE: Three; renderer: T.WebGLRenderer; env: T.Texture } & ReturnType<typeof makeKit>;

function makeKit(THREE: Three) {
  const ink = new THREE.Color(0x1a1012);
  const geos = {
    eye: new THREE.SphereGeometry(1, 32, 20),
    hi: new THREE.SphereGeometry(1, 16, 10),
    arc: new THREE.TorusGeometry(0.09, 0.024, 10, 28, Math.PI),
    smile: new THREE.TorusGeometry(0.075, 0.019, 10, 28, Math.PI),
    ring: new THREE.TorusGeometry(0.038, 0.016, 10, 24),
    bar: new THREE.BoxGeometry(0.11, 0.022, 0.02),
    half: new THREE.CircleGeometry(0.09, 32, Math.PI, Math.PI),
    tongue: new THREE.CircleGeometry(0.042, 24),
    cheek: new THREE.CircleGeometry(0.07, 24),
    brow: new THREE.BoxGeometry(0.12, 0.024, 0.02),
    shadow: new THREE.PlaneGeometry(2.8, 2.8),
  };
  const mats = {
    eye: new THREE.MeshPhysicalMaterial({ color: ink, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.05 }),
    white: new THREE.MeshBasicMaterial({ color: 0xffffff }),
    pink: new THREE.MeshBasicMaterial({ color: 0xff9db5 }),
    mouth: new THREE.MeshBasicMaterial({ color: 0x5a1426 }),
    tongue: new THREE.MeshBasicMaterial({ color: 0xff8fa8 }),
    shadow: new THREE.MeshBasicMaterial({ map: shadowTexture(THREE), transparent: true, opacity: 0.22, depthWrite: false }),
  };
  return { geos, mats };
}

let enginePromise: Promise<Engine | null> | null = null;

function getEngine(): Promise<Engine | null> {
  enginePromise ??= import("three")
    .then((THREE) => {
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(1);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.82;
      renderer.setClearColor(0x000000, 0);

      // A soft studio built in place: a grey room with three light panels
      const room = new THREE.Scene();
      room.add(new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshBasicMaterial({ color: 0x5e5753, side: THREE.BackSide })));
      const panel = (w: number, h: number, p: [number, number, number], r: [number, number, number], k: number) => {
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k, k), side: THREE.DoubleSide }));
        mesh.position.set(...p);
        mesh.rotation.set(...r);
        room.add(mesh);
      };
      panel(6, 3, [0, 4.9, 0], [Math.PI / 2, 0, 0], 6);
      panel(3, 4, [-4.9, 1, 1.5], [0, Math.PI / 2, 0], 3.5);
      panel(3, 3, [4.9, 0, -1], [0, -Math.PI / 2, 0], 1.6);
      panel(4, 2, [0, 0, 4.9], [0, 0, 0], 1.2);
      const env = new THREE.PMREMGenerator(renderer).fromScene(room, 0.03).texture;

      return { THREE, renderer, env, ...makeKit(THREE) };
    })
    .catch(() => null);
  return enginePromise;
}

function shadowTexture(THREE: Three) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 64;
  const context = canvas.getContext("2d");
  if (context) {
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(40,20,10,1)");
    gradient.addColorStop(1, "rgba(40,20,10,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);
  }
  return new THREE.CanvasTexture(canvas);
}

type Impact = { u: T.Vector3; t0: number; a: number; f: number; k: number };
type Poke = { type: Reaction; t0: number; dir: number; amp: number; f: number; k: number };

class Jelly {
  readonly scene: T.Scene;
  readonly camera: T.PerspectiveCamera;
  private root: T.Group;
  private mover: T.Group;
  private geo: T.SphereGeometry;
  private base: Float32Array;
  private mat: T.MeshPhysicalMaterial;
  private baseColor: T.Color;
  private fadeColor: T.Color;
  private anchors: { g: T.Group; u: T.Vector3; lift: number }[] = [];
  private parts = new Map<FacePart, { m: T.Object3D; s: T.Vector3; cur: number }[]>();
  private eyes: T.Group[] = [];
  private shadow: T.Mesh | null = null;
  private impacts: Impact[] = [];
  private poke: Poke | null = null;
  private lastReaction: Reaction | null = null;
  private st = { amp: 0.03, spd: 1, wave: 0, follow: 1, eyeS: 1, fade: 0, lookX: 0, lookY: 0, phase: 0, rx: 0, ry: 0 };
  private blinkAt = 1 + Math.random() * 3;
  private wander: [number, number] = [0, 0];
  private wanderAt = 0;

  constructor(
    private e: Engine,
    segments: number,
    withShadow: boolean
  ) {
    const { THREE, geos, mats } = e;
    this.scene = new THREE.Scene();
    this.scene.environment = e.env;
    const key = new THREE.DirectionalLight(0xffffff, 3.4);
    key.position.set(2, 3, 4);
    this.scene.add(key, new THREE.HemisphereLight(0xfff3ea, 0x40261a, 1.1));
    this.camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
    this.camera.position.set(0, 0.2, 6.8);
    this.camera.lookAt(0, 0.05, 0);

    this.root = new THREE.Group();
    this.mover = new THREE.Group();
    this.root.add(this.mover);
    this.scene.add(this.root);
    if (withShadow) {
      this.shadow = new THREE.Mesh(geos.shadow, mats.shadow.clone());
      this.shadow.rotation.x = -Math.PI / 2;
      this.shadow.position.y = -1.25;
      this.scene.add(this.shadow);
    }

    this.geo = new THREE.SphereGeometry(1, segments, Math.round(segments * 0.75));
    this.base = Float32Array.from((this.geo.attributes.position as T.BufferAttribute).array);
    this.mat = new THREE.MeshPhysicalMaterial({ color: ORANGE, roughness: 0.5, clearcoat: 0.25, clearcoatRoughness: 0.08, emissive: 0x3a0e00 });
    this.baseColor = this.mat.color.clone();
    this.fadeColor = new THREE.Color(0xd9a084);
    this.mover.add(new THREE.Mesh(this.geo, this.mat));
    this.buildFace();
  }

  private anchor(x: number, y: number, lift: number) {
    const { THREE } = this.e;
    const u = new THREE.Vector3(x, y, Math.sqrt(1 - x * x - y * y)).normalize();
    const g = new THREE.Group();
    g.position.copy(u);
    this.mover.add(g);
    g.lookAt(u.clone().multiplyScalar(2));
    this.anchors.push({ g, u, lift });
    return g;
  }

  private part(key: FacePart, parent: T.Object3D, m: T.Object3D) {
    parent.add(m);
    m.visible = false;
    const list = this.parts.get(key) ?? [];
    list.push({ m, s: m.scale.clone(), cur: 0 });
    this.parts.set(key, list);
  }

  private buildFace() {
    const { THREE, geos, mats } = this.e;
    for (const side of [-1, 1]) {
      const g = this.anchor(side * 0.26, 0.14, 0.026);
      const look = new THREE.Group();
      g.add(look);
      this.eyes.push(look);
      const ball = new THREE.Mesh(geos.eye, mats.eye);
      ball.scale.set(0.12, 0.146, 0.06);
      const shine = new THREE.Mesh(geos.hi, mats.white);
      shine.scale.setScalar(0.036);
      shine.position.set(-0.038, 0.058, 0.05);
      const eye = new THREE.Group();
      eye.add(ball, shine);
      this.part("eyeRound", look, eye);
      const happy = new THREE.Mesh(geos.arc, mats.eye);
      happy.position.y = -0.03;
      this.part("eyeHappy", g, happy);
      const closed = new THREE.Mesh(geos.arc, mats.eye);
      closed.rotation.z = Math.PI;
      closed.position.y = 0.02;
      this.part("eyeClosed", g, closed);
      const brow = new THREE.Mesh(geos.brow, mats.eye);
      brow.position.y = 0.2;
      brow.rotation.z = -side * 0.32;
      this.part("brows", g, brow);
    }
    const mouth = this.anchor(0, -0.07, 0.018);
    const smile = new THREE.Mesh(geos.smile, mats.eye);
    smile.rotation.z = Math.PI;
    this.part("smile", mouth, smile);
    this.part("o", mouth, new THREE.Mesh(geos.ring, mats.eye));
    const open = new THREE.Group();
    open.add(new THREE.Mesh(geos.half, mats.mouth));
    const tongue = new THREE.Mesh(geos.tongue, mats.tongue);
    tongue.position.set(0, -0.047, 0.002);
    open.add(tongue);
    open.position.y = 0.02;
    this.part("open", mouth, open);
    this.part("flat", mouth, new THREE.Mesh(geos.bar, mats.eye));
    const frown = new THREE.Mesh(geos.smile, mats.eye);
    frown.position.y = -0.06;
    this.part("frown", mouth, frown);
    for (const side of [-1, 1]) {
      const cheek = new THREE.Mesh(geos.cheek, mats.pink);
      cheek.scale.x = 1.3;
      this.part("cheeks", this.anchor(side * 0.45, -0.05, 0.008), cheek);
    }
  }

  private surface(x: number, y: number, z: number, t: number) {
    const st = this.st;
    let w = st.amp * (Math.sin(3.1 * x + st.phase * 1.7) * Math.sin(2.6 * y + st.phase * 1.3) + 0.8 * Math.sin(3.7 * z + st.phase * 2.1));
    if (st.wave > 0.001) w += st.wave * Math.sin(y * 6 - t * 3.2);
    for (const im of this.impacts) {
      const age = t - im.t0;
      const c = x * im.u.x + y * im.u.y + z * im.u.z;
      const angle = Math.acos(Math.max(-1, Math.min(1, c)));
      w -= im.a * Math.exp(-age * im.k) * Math.cos(age * im.f - angle * 5) * Math.exp(-angle * 1.6);
    }
    return 1 + w;
  }

  /** A press at a point in normalized device coordinates: a dent there and a random reaction. */
  press(t: number, ndcX: number, ndcY: number, still: boolean) {
    const { THREE } = this.e;
    let type: Reaction;
    do type = REACTIONS[Math.floor(Math.random() * REACTIONS.length)] ?? "boing";
    while (type === this.lastReaction);
    this.lastReaction = type;
    if (still) return;
    this.poke = { type, t0: t, dir: Math.random() < 0.5 ? -1 : 1, amp: 0.7 + Math.random() * 0.6, f: 11 + Math.random() * 9, k: 3 + Math.random() * 3 };

    const ray = new THREE.Raycaster();
    ray.setFromCamera(new THREE.Vector2(ndcX, ndcY), this.camera);
    this.root.updateMatrixWorld(true);
    const hit = new THREE.Vector3();
    const u = ray.ray.intersectSphere(new THREE.Sphere(new THREE.Vector3(), 1), hit)
      ? this.mover.worldToLocal(hit).normalize()
      : new THREE.Vector3((Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.6, 1).normalize();
    this.impacts.push({ u, t0: t, a: 0.07 + Math.random() * 0.08, f: 12 + Math.random() * 8, k: 2.5 + Math.random() * 2 });
    if (this.impacts.length > 4) this.impacts.shift();
  }

  /** A small hop with no dent, for the pointer arriving. */
  perk(t: number) {
    if (this.poke && t - this.poke.t0 < 1.2) return;
    this.poke = { type: "hop", t0: t, dir: 1, amp: 0.35, f: 14, k: 4 };
  }

  update(t: number, dt: number, pose: Pose, aimX: number, aimY: number, still: boolean) {
    const st = this.st;
    const target = POSES[pose];
    const a = still ? 1 : Math.min(1, dt * 4);
    st.amp += ((still ? 0 : target.amp) - st.amp) * a;
    st.spd += (target.spd - st.spd) * a;
    st.wave += ((still ? 0 : target.wave) - st.wave) * a;
    st.follow += (target.follow - st.follow) * a;
    st.eyeS += (target.eyeS - st.eyeS) * a;
    st.fade += (target.fade - st.fade) * a;
    st.phase += dt * st.spd;
    while (this.impacts[0] && t - this.impacts[0].t0 > 2.5) this.impacts.shift();

    // Turn toward the pointer
    const turn = still ? 1 : Math.min(1, dt * 5);
    st.ry += (aimX * 0.6 * st.follow - st.ry) * turn;
    st.rx += (aimY * 0.35 * st.follow - st.rx) * turn;
    this.root.rotation.set(st.rx, st.ry, 0);

    // Face, with a short override from some reactions
    const age = this.poke ? t - this.poke.t0 : 9;
    let face = target.face;
    let eyeBoost = 1;
    if (this.poke?.type === "surprise" && age < 0.9) {
      face = { eyeRound: 1, o: 1 };
      eyeBoost = 1.35;
    }
    if (this.poke?.type === "giggle" && age < 1) face = { eyeHappy: 1, open: 1, cheeks: 1.2 };
    const fk = still ? 1 : Math.min(1, dt * 12);
    for (const key of PARTS) {
      for (const p of this.parts.get(key) ?? []) {
        p.cur += ((face[key] ?? 0) - p.cur) * fk;
        p.m.visible = p.cur > 0.02;
        p.m.scale.copy(p.s).multiplyScalar(Math.max(0.001, p.cur));
      }
    }

    if (t > this.wanderAt) {
      this.wander = pose === "idle" && !still ? [(Math.random() - 0.5) * 0.05, (Math.random() - 0.5) * 0.03] : [0, 0];
      this.wanderAt = t + 1.5 + Math.random() * 2;
    }
    const look = target.look ?? this.wander;
    const lk = still ? 1 : Math.min(1, dt * 5);
    st.lookX += (look[0] - st.lookX) * lk;
    st.lookY += (look[1] - st.lookY) * lk;
    if (t > this.blinkAt + 0.14) this.blinkAt = t + 1.8 + Math.random() * 3.5;
    const shut = !still && pose !== "working" && t > this.blinkAt && t < this.blinkAt + 0.14;
    for (const eye of this.eyes) {
      eye.position.set(st.lookX, st.lookY, 0);
      eye.scale.set(eyeBoost, st.eyeS * eyeBoost * (shut ? 0.1 : 1), 1);
    }

    // Body motion plus the reaction to a press
    const m = still ? motion(pose, 0) : motion(pose, t);
    if (still) Object.assign(m, { y: 0, rx: 0, ry: 0, rz: pose === "sad" ? 0.13 : 0, sx: pose === "sad" ? 1.07 : 1, sy: pose === "sad" ? 0.9 : 1 });
    const p = this.poke;
    if (p && age < 1.6) {
      const s = Math.sin(age * p.f) * Math.exp(-age * p.k) * p.amp;
      if (p.type === "boing") {
        m.sx += s * 0.16;
        m.sy -= s * 0.16;
      } else if (p.type === "jiggle") {
        m.rz += s * 0.25 * p.dir;
      } else if (p.type === "hop") {
        const h = age < 0.55 ? Math.sin((age / 0.55) * Math.PI) : 0;
        m.y += h * 0.4 * p.amp;
        if (age > 0.5 && age < 0.8) {
          const q = Math.sin(((age - 0.5) / 0.3) * Math.PI);
          m.sy -= q * 0.12;
          m.sx += q * 0.09;
        }
      } else if (p.type === "spin") {
        m.ry += ease(age / 0.75) * Math.PI * 2 * p.dir;
      } else if (p.type === "surprise") {
        const q = Math.exp(-age * 3);
        m.sy += 0.1 * q;
        m.sx -= 0.06 * q;
        m.y += 0.06 * q;
      } else if (p.type === "giggle") {
        m.x += Math.sin(age * 42) * 0.03 * Math.exp(-age * 2.5);
      } else {
        const q = Math.sin(Math.min(1, age / 1.2) * Math.PI);
        m.sx += q * 0.12 * p.dir;
        m.sy -= q * 0.1 * p.dir;
        m.rx += Math.sin(age * p.f * 0.5) * Math.exp(-age * 3) * 0.12;
      }
    }
    const mv = this.mover;
    const k = still ? 1 : Math.min(1, dt * 10);
    mv.position.x += (m.x - mv.position.x) * k;
    mv.position.y += (m.y - mv.position.y) * k;
    mv.rotation.x += (m.rx - mv.rotation.x) * k;
    mv.rotation.z += (m.rz - mv.rotation.z) * k;
    mv.rotation.y = m.ry;
    mv.scale.x += (m.sx - mv.scale.x) * k;
    mv.scale.y += (m.sy - mv.scale.y) * k;
    mv.scale.z += (m.sx - mv.scale.z) * k;
    this.mat.color.copy(this.baseColor).lerp(this.fadeColor, st.fade * 0.45);
    if (this.shadow) {
      const lift = Math.max(0, mv.position.y);
      this.shadow.scale.setScalar(1 - lift * 0.5);
      (this.shadow.material as T.MeshBasicMaterial).opacity = 0.22 * (1 - lift * 0.8);
    }

    // The surface first, then the face rides on top of it so it never sinks in
    const pos = this.geo.attributes.position as T.BufferAttribute;
    const arr = pos.array as Float32Array;
    const base = this.base;
    for (let i = 0; i < arr.length; i += 3) {
      const x = base[i] ?? 0;
      const y = base[i + 1] ?? 0;
      const z = base[i + 2] ?? 0;
      const s = this.surface(x, y, z, t);
      arr[i] = x * s;
      arr[i + 1] = y * s;
      arr[i + 2] = z * s;
    }
    pos.needsUpdate = true;
    this.geo.computeVertexNormals();
    for (const an of this.anchors) an.g.position.copy(an.u).multiplyScalar(this.surface(an.u.x, an.u.y, an.u.z, t) + an.lift);
  }

  dispose() {
    this.geo.dispose();
    this.mat.dispose();
    (this.shadow?.material as T.Material | undefined)?.dispose();
  }
}

type JellyHandle = {
  setMood: (mood: Mood) => void;
  setSize: (size: number) => void;
  setHover: (hover: boolean) => void;
  press: (clientX: number, clientY: number) => void;
  destroy: () => void;
};

type Instance = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  jelly: Jelly;
  size: number;
  mood: Mood;
  hover: boolean;
  visible: boolean;
  born: number;
  greet: boolean;
  dirtyUntil: number;
};

const instances = new Set<Instance>();
let frame = 0;
let clockStart = 0;
let last = 0;
let pointer: { x: number; y: number } | null = null;
let movedAt = 0;
let observer: IntersectionObserver | null = null;
let listening = false;

const now = () => (performance.now() - clockStart) / 1000;
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function onPointerMove(event: PointerEvent) {
  pointer = { x: event.clientX, y: event.clientY };
  movedAt = performance.now();
  wake();
}

function onVisibility() {
  if (!document.hidden) wake();
}

function wake() {
  if (frame || !instances.size || document.hidden) return;
  last = now();
  frame = requestAnimationFrame(tick);
}

function poseOf(instance: Instance, t: number): Pose {
  if (instance.greet && t - instance.born < HELLO_S) return "hello";
  if (instance.mood !== "idle") return instance.mood;
  if (instance.hover) return "hover";
  if (movedAt && performance.now() - movedAt > SLEEP_MS) return "sleeping";
  return "idle";
}

function tick() {
  frame = 0;
  const engine = engineRef;
  if (!engine || document.hidden) return;
  const t = now();
  const dt = Math.min(0.05, t - last);
  last = t;
  const still = reducedMotion();
  let active = false;

  for (const instance of instances) {
    if (!instance.visible) continue;
    if (still && t > instance.dirtyUntil) continue;
    active = true;
    const box = instance.canvas.getBoundingClientRect();
    let aimX = 0;
    let aimY = 0;
    if (pointer && box.width) {
      const reach = Math.max(220, box.width * 2);
      aimX = Math.max(-1, Math.min(1, (pointer.x - (box.left + box.width / 2)) / reach));
      aimY = Math.max(-1, Math.min(1, (pointer.y - (box.top + box.height / 2)) / reach));
    }
    instance.jelly.update(t, dt, poseOf(instance, t), aimX, aimY, still);
    draw(engine, instance);
  }
  if (active) frame = requestAnimationFrame(tick);
}

function draw(engine: Engine, instance: Instance) {
  const { renderer } = engine;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const px = Math.max(1, Math.round(instance.size * JELLY_BLEED * ratio));
  if (instance.canvas.width !== px) instance.canvas.width = instance.canvas.height = px;
  const size = renderer.getSize(new engine.THREE.Vector2());
  if (size.x < px || size.y < px) renderer.setSize(Math.max(size.x, px), Math.max(size.y, px), false);
  const height = renderer.domElement.height;
  renderer.setViewport(0, 0, px, px);
  renderer.setScissor(0, 0, px, px);
  renderer.setScissorTest(true);
  renderer.clear();
  instance.jelly.camera.aspect = 1;
  instance.jelly.camera.updateProjectionMatrix();
  renderer.render(instance.jelly.scene, instance.jelly.camera);
  instance.context.clearRect(0, 0, px, px);
  instance.context.drawImage(renderer.domElement, 0, height - px, px, px, 0, 0, px, px);
}

let engineRef: Engine | null = null;

/**
 * Starts a jelly drawing into `canvas`, which should be `size * JELLY_BLEED`
 * CSS pixels square and centred on the mascot's box. Resolves to null without WebGL.
 */
async function mountJelly(canvas: HTMLCanvasElement, options: { size: number; greet?: boolean; mood?: Mood }): Promise<JellyHandle | null> {
  const engine = await getEngine();
  const context = canvas.getContext("2d");
  if (!engine || !context) return null;
  engineRef = engine;
  if (!clockStart) clockStart = performance.now();

  const segments = options.size <= 24 ? 28 : options.size <= 48 ? 40 : 64;
  const instance: Instance = {
    canvas,
    context,
    jelly: new Jelly(engine, segments, options.size >= 48),
    size: options.size,
    mood: options.mood ?? "idle",
    hover: false,
    visible: true,
    born: now(),
    greet: Boolean(options.greet),
    dirtyUntil: now() + 1,
  };
  instances.add(instance);

  if (!listening) {
    listening = true;
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        for (const item of instances) if (item.canvas === entry.target) item.visible = entry.isIntersecting;
      }
      wake();
    });
  }
  observer?.observe(canvas);
  wake();

  const touch = () => {
    instance.dirtyUntil = now() + 1;
    wake();
  };

  return {
    setMood: (mood) => {
      if (instance.mood === mood) return;
      instance.mood = mood;
      touch();
    },
    setSize: (size) => {
      if (instance.size === size) return;
      instance.size = size;
      touch();
    },
    setHover: (hover) => {
      if (instance.hover === hover) return;
      instance.hover = hover;
      if (hover && instance.mood === "idle" && !reducedMotion()) instance.jelly.perk(now());
      touch();
    },
    press: (clientX, clientY) => {
      const box = canvas.getBoundingClientRect();
      if (!box.width) return;
      const x = ((clientX - box.left) / box.width) * 2 - 1;
      const y = -(((clientY - box.top) / box.height) * 2 - 1);
      movedAt = performance.now();
      instance.jelly.press(now(), x, y, reducedMotion());
      touch();
    },
    destroy: () => {
      observer?.unobserve(canvas);
      instances.delete(instance);
      instance.jelly.dispose();
      if (!instances.size && listening) {
        listening = false;
        window.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("visibilitychange", onVisibility);
        observer?.disconnect();
        observer = null;
        cancelAnimationFrame(frame);
        frame = 0;
      }
    },
  };
}

type Size = "sm" | "md" | "lg" | "xl";

// A box of its own, since previews lay a piece out with no size to fill
const sizeClasses: Record<Size, string> = {
  sm: "w-40",
  md: "w-64",
  lg: "w-80",
  xl: "w-96",
};

interface Mascot1Props {
  mood?: Mood;
  size?: Size;
  /** Waves hello once when it appears. */
  greet?: boolean;
  className?: string;
}

export const mascot1Demo: Mascot1Props = {
  mood: "idle",
  size: "md",
  greet: true,
};

export function Mascot1({ mood = "idle", size: boxSize = "md", greet = true, className }: Mascot1Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<JellyHandle | null>(null);
  const moodRef = useRef(mood);
  moodRef.current = mood;
  const [size, setSize] = useState(0);
  const [ready, setReady] = useState(false);
  const sizeRef = useRef(size);
  sizeRef.current = size;

  // The mascot fills the slot, with room left for its canvas to bleed
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const measure = () => {
      const side = Math.min(box.clientWidth, box.clientHeight);
      setSize(Math.max(16, Math.floor(side / JELLY_BLEED)));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  const mounted = size > 0;
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!mounted || !canvas) return;
    let alive = true;
    void mountJelly(canvas, { size: sizeRef.current, greet, mood: moodRef.current }).then((handle) => {
      if (!alive) {
        handle?.destroy();
        return;
      }
      handleRef.current = handle;
      setReady(Boolean(handle));
    });
    return () => {
      alive = false;
      handleRef.current?.destroy();
      handleRef.current = null;
    };
  }, [mounted, greet]);

  useEffect(() => {
    if (size) handleRef.current?.setSize(size);
  }, [size]);

  useEffect(() => {
    handleRef.current?.setMood(mood);
  }, [mood]);

  const canvasSize = size * JELLY_BLEED;

  return (
    <div className={cn("relative flex size-full items-center justify-center p-4", className)}>
      <div
        ref={boxRef}
        className={cn("relative flex aspect-square max-h-full max-w-full items-center justify-center", sizeClasses[boxSize])}
      >
        {mounted && (
          <span
            role="img"
            aria-label="Bestie"
            onPointerEnter={() => handleRef.current?.setHover(true)}
            onPointerLeave={() => handleRef.current?.setHover(false)}
            onPointerDown={(event) => handleRef.current?.press(event.clientX, event.clientY)}
            className="relative block shrink-0 cursor-pointer touch-manipulation select-none"
            style={{ width: size, height: size }}
          >
            {!ready && (
              <span
                aria-hidden
                className="absolute inset-1 rounded-full bg-gradient-to-br from-orange-400 to-orange-600"
              />
            )}
            <canvas
              ref={canvasRef}
              aria-hidden
              className="pointer-events-none absolute max-w-none"
              style={{
                width: canvasSize,
                height: canvasSize,
                left: (size - canvasSize) / 2,
                top: (size - canvasSize) / 2,
              }}
            />
          </span>
        )}
      </div>
    </div>
  );
}
