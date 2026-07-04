let body = $response.body;

body = body.replace(
"</head>",
`
<style>

body{

background:red!important;

}

</style>

</head>
`
);

$done({body});
