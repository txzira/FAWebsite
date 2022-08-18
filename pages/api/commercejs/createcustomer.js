export default async function handler(req, res) {
  if (req.method === "POST") {
    let url = new URL("https://api.chec.io/v1/customers");

    const headers = {
      "X-Authorization": `${process.env.NEXT_PUBLIC_CHEC_SECRET_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    console.log(req.body);

    try {
      const createCustomer = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(req.body),
      });
      let customer = await createCustomer.json();
      customer = await Promise.resolve(customer);
      url = new URL(
        `https://api.chec.io/v1/customers/${customer.id}/issue-token`
      );
      try {
        fetch(url, {
          method: "POST",
          headers: headers,
        }).then((response) =>
          response.json().then((token) => res.status(201).json(token))
        );
      } catch (err) {
        res.status(err.statusCode || 500).json(err.message);
      }
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
