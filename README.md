<p align="center">
  <img src="https://github.com/bongsusu/banner/blob/main/Purple%20and%20Black%20Modern%20Game%20Streamer%20Twitch%20Banner.jpg" alt="Banner" width="100%">
</p>

> ⚠️ **Cảnh báo sử dụng**  
> Không được sử dụng nội dung trong kho lưu trữ này cho mục đích vi phạm pháp luật hoặc lừa đảo!  
> Nếu chia sẻ, **vui lòng ghi rõ nguồn hoặc tên tác giả**.  
---

# 🎬 YouTube Premium 2025 - Nightmarket

📺 **Chặn quảng cáo toàn diện**, phát nền, phát PiP, tối ưu trải nghiệm YouTube không quảng cáo dành riêng cho ứng dụng **Shadowrocket (iOS)**.

---

## 📌 Tính năng chính

- 🚫 **Chặn quảng cáo video, popup, tracking**
- 🕹️ **Phát nền / Picture-in-Picture (PiP)**
- 📥 **Ẩn nút upload và shorts nếu muốn**
- 🌐 **Hỗ trợ ngôn ngữ phụ đề + lời bài hát (zh-Hans)**
- ⚙️ Tích hợp MITM, Rewrite, Script đầy đủ

---

## 🧠 Thông tin kỹ thuật

- Tác giả gốc: `@DivineEngine`, `@app2smile`, `@Maasea`, `@VirgilClyne`  
- Gợi ý & bổ sung: `@Choler`, `@bai1zi`  
- Tổng hợp & phát hành dưới dạng Quantumult X: `@ddgksf2013`  
- **Bản dịch & tinh chỉnh cho Shadowrocket bởi**: `@deezertidal`  
- **Phân phối lại bởi**: `Nightmarket Server`  

---

## 🚀 Hướng dẫn sử dụng

1. Tải file `.module` từ thư mục release
2. Mở Shadowrocket > Modules > Import
3. Bật **Script**, **Rewrite**, và thêm các hostname vào MITM
4. Khởi động lại ứng dụng và thưởng thức

---

## 🧾 Nội dung file `YouTubePremium2025.module`

```ini
#!name=YouTube Premium 2025 - Nightmarket
#!desc=Chặn quảng cáo YouTube toàn diện kèm trình phát PiP
#!arguments=blockUpload:true,blockImmersive:true,captionLang:zh-Hans,lyricLang:zh-Hans,scriptExecutionEngine:auto,debug:false
# Tác giả gốc: @DivineEngine, @app2smile, @Maasea, @VirgilClyne
# Gợi ý bổ sung: @Choler, @bai1zi
# Tổng hợp và phát hành dạng qx bởi: @ddgksf2013
# Dịch và tinh chỉnh cho Shadowrocket bởi: @deezertidal
# Phân phối bởi: Nightmarket Server

[Rule]
AND,((DOMAIN-SUFFIX,googlevideo.com), (PROTOCOL,UDP)),REJECT
AND,((DOMAIN,youtubei.googleapis.com), (PROTOCOL,UDP)),REJECT

[Url Rewrite]
^https?:\/\/[\w-]+\.googlevideo\.com\/(?!(dclk_video_ads|videoplayback\?)).+&oad _ reject-200
^https?:\/\/(www|s)\.youtube\.com\/api\/stats\/ads _ reject-200
^https?:\/\/(www|s)\.youtube\.com\/(pagead|ptracking) _ reject-200
^https?:\/\/s\.youtube\.com\/api\/stats\/qoe\?adcontext _ reject-200
(^https?:\/\/[\w-]+\.googlevideo\.com\/(?!dclk_video_ads).+?)&ctier=L(&.+?),ctier,(.+) $1$2$3 302

[Script]
youtube.response = type=http-response,pattern=^https:\/\/youtubei\.googleapis\.com\/youtubei\/v1\/(browse|next|player|search|reel\/reel_watch_sequence|guide|account\/get_setting|get_watch),requires-body=1,max-size=-1,binary-body-mode=1,engine={{{脚本执行引擎}}},script-path=https://raw.githubusercontent.com/Maasea/sgmodule/master/Script/Youtube/youtube.response.js,argument="{"lyricLang":"{{{歌词翻译语言}}}","captionLang":"{{{字幕翻译语言}}}","blockUpload":{{{屏蔽上传按钮}}},"blockImmersive":{{{屏蔽选段按钮}}},"debug":{{{启用调试模式}}}}"

[MITM]
hostname = %APPEND% -redirector*.googlevideo.com,*.googlevideo.com,www.youtube.com,s.youtube.com,youtubei.googleapis.com
