async function run(url) {
  const res = await fetch(url, { redirect: "follow" });
  console.log(res.url);
}
run("https://chshare.link/player/nGmHX0");
run("https://chshare.link/player/b0a6Bq");
