export let displayHomePage = (req, res) => {
  res.send("data from send()");
};

export let displayAboutPage = (req, res) => {
  res.end("about page");
};

export let sendJSON = (req, res) => {
  res.status(202).json({ success: true, message: "", data: {}, error: {} });
};
