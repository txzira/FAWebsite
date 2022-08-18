export default async function handler(req, res) {
  if (req.method === "POST") {
    let url;
    const dataArr = [];
    let headers = {
      "X-Authorization": `${process.env.NEXT_PUBLIC_CHEC_SECRET_API_KEY}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    // console.log(req.body[0])
    try {
      req.body.map((asset) => {
        asset.assets.map((id) => {
          url = new URL(`https://api.chec.io/v1/assets/${id}`);
          //console.log(url)
          dataArr.push(
            fetch(url, {
              method: "GET",
              headers: headers,
            }).then(function (response) {
              return response.json();
            })
          );
        });
      });
      Promise.all(dataArr).then((values) => res.status(200).json(values));
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
