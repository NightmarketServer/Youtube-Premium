/**
 * Youtube (Music) Enhance - Auto Fixed v3
 * Author: NightmarketServer
 * Date: 2025-10-25
 * Mode: Auto (no arguments needed)
 * Compatible: Shadowrocket / Surge / Loon / QuanX
 */

!(async () => {
  const debug = false; // đổi true nếu muốn log ra console
  const log = (...msg) => { if (debug) console.log("[YT Enhance]", ...msg); };

  try {
    let body = "";
    if ($response?.bodyBytes) {
      try {
        body = new TextDecoder("utf-8").decode($response.bodyBytes);
      } catch {
        body = $response.body ?? "";
      }
    } else {
      body = $response?.body ?? "";
    }

    // Kiểm tra JSON
    let data;
    try {
      data = JSON.parse(body);
    } catch {
      log("❌ Không phải JSON, bỏ qua...");
      $done({});
      return;
    }

    // 1️⃣ Xoá quảng cáo
    const removeAds = (obj) => {
      if (!obj || typeof obj !== "object") return;
      if (Array.isArray(obj)) {
        obj.forEach(removeAds);
      } else {
        if (obj.adPlacements) delete obj.adPlacements;
        if (obj.adSlots) delete obj.adSlots;
        if (obj.playerAds) delete obj.playerAds;
        if (obj.playbackTracking?.pageadViewthroughconversion)
          delete obj.playbackTracking.pageadViewthroughconversion;
        Object.keys(obj).forEach((k) => removeAds(obj[k]));
      }
    };
    removeAds(data);

    // 2️⃣ Ẩn Upload, Shorts, Immersive
    const bannedIds = ["FEuploads", "FEshorts", "FEshorts_mweb", "FEmusic_immersive"];
    const cleanUI = (obj) => {
      if (!obj || typeof obj !== "object") return;
      Object.keys(obj).forEach((key) => {
        const v = obj[key];
        if (Array.isArray(v)) {
          obj[key] = v.filter((item) => {
            const id =
              item?.guideEntryRenderer?.browseId ||
              item?.navigationEndpoint?.browseId ||
              item?.browseId ||
              "";
            if (bannedIds.includes(id)) {
              log("🧹 Xoá mục:", id);
              return false;
            }
            cleanUI(item);
            return true;
          });
        } else if (typeof v === "object") {
          cleanUI(v);
        }
      });
    };
    cleanUI(data);

    // 3️⃣ Thêm hỗ trợ Picture-in-Picture & Background
    if (data?.player?.playabilityStatus) {
      data.player.playabilityStatus.pictureInPictureRender = {
        pictureInPictureAbility: { active: true },
      };
      data.player.playabilityStatus.backgroundPlayerRender = {
        backgroundAbility: { active: true },
      };
      log("🎬 Bật PIP + Background");
    }

    // 4️⃣ Tự động thêm phụ đề dịch sang tiếng Anh (tlang=en)
    try {
      const tracks = data?.player?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
      if (Array.isArray(tracks) && !tracks.some((t) => t.languageCode === "en")) {
        const base = tracks[0];
        if (base) {
          const clone = JSON.parse(JSON.stringify(base));
          clone.languageCode = "en";
          clone.baseUrl += "&tlang=en";
          clone.name = { simpleText: "Auto-Translate (en)" };
          tracks.push(clone);
          log("🌐 Thêm phụ đề dịch tiếng Anh");
        }
      }
    } catch (e) {
      log("Phụ đề:", e);
    }

    // 5️⃣ Trả kết quả
    const result = JSON.stringify(data);
    if ($response.bodyBytes) {
      const bytes = new TextEncoder().encode(result);
      $done({ ...$response, bodyBytes: bytes });
    } else {
      $done({ ...$response, body: result });
    }

    log("✅ Xử lý xong YouTube response");
  } catch (err) {
    console.log("[YT Enhance] Lỗi:", err);
    $done({});
  }
})();
