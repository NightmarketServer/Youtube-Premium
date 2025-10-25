/*
 * YouTube ProtoBuf Runtime — Fixed for Shadowrocket (ES6+ Safe)
 * Last updated: 2025-10-25
 * Works in iOS JavaScriptCore (no require/import)
 */

// ===== Polyfills (for older iOS) =====
if (typeof TextEncoder === "undefined" || typeof TextDecoder === "undefined") {
  function TextEncoder() {
    this.encode = function (str) {
      const out = [];
      for (let i = 0; i < str.length; i++) out.push(str.charCodeAt(i));
      return new Uint8Array(out);
    };
  }
  function TextDecoder() {
    this.decode = function (buf) {
      let out = "";
      for (let i = 0; i < buf.length; i++) out += String.fromCharCode(buf[i]);
      return out;
    };
  }
  this.TextEncoder = TextEncoder;
  this.TextDecoder = TextDecoder;
}

// ===== Protobuf Reader / Writer =====
class ProtoReader {
  constructor(buf) {
    this.buf = new Uint8Array(buf);
    this.pos = 0;
  }
  uint32() {
    let value = 0, shift = 0;
    while (true) {
      const b = this.buf[this.pos++];
      value |= (b & 0x7f) << shift;
      if ((b & 0x80) === 0) break;
      shift += 7;
    }
    return value >>> 0;
  }
  string() {
    const len = this.uint32();
    const start = this.pos;
    this.pos += len;
    return new TextDecoder("utf-8").decode(this.buf.slice(start, start + len));
  }
}

class ProtoWriter {
  constructor() {
    this.buf = [];
  }
  uint32(value) {
    while (value > 127) {
      this.buf.push((value & 0x7f) | 0x80);
      value >>>= 7;
    }
    this.buf.push(value);
  }
  string(str) {
    const bytes = new TextEncoder().encode(str);
    this.uint32(bytes.length);
    this.buf.push(...bytes);
  }
  finish() {
    return new Uint8Array(this.buf);
  }
}

// ===== YouTube Response (Minimal Runtime) =====
const youtube = {
  response: {
    player: {
      Player: class {
        constructor(data = {}) {
          this.videoId = data.videoId ?? "";
          this.title = data.title ?? "";
          this.author = data.author ?? "";
        }
        static fromBinary(buf) {
          try {
            const r = new ProtoReader(buf);
            return new this({ title: r.string() });
          } catch (e) {
            console.log("Decode failed:", e);
            return new this();
          }
        }
        toBinary() {
          const w = new ProtoWriter();
          w.string(this.title);
          return w.finish();
        }
      },
    },
    browse: {
      Browse: class {
        constructor(data = {}) {
          this.section = data.section ?? "";
        }
        static fromBinary(buf) {
          const r = new ProtoReader(buf);
          return new this({ section: r.string() });
        }
      },
    },
  },
};

console.log("[✅ YouTube ProtoBuf Runtime for Shadowrocket loaded OK]");
this.youtube = youtube;
