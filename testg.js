let body = $response.body;

body = body.replace(
  "</body>",
  `
<div id="night-market-test"
style="
position:fixed;
top:30px;
left:30px;
z-index:999999999;
background:red;
color:white;
padding:20px;
font-size:30px;
border-radius:12px;">
🚀 Shadowrocket Inject Success
</div>

</body>
`
);

$done({ body });
