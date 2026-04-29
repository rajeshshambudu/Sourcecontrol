const API_KEY = "AIzaSyCfXL0IdUJv4gs8_w3Pa_x0k4yGhz8-djo";

async function testAPI() {
  const text = document.getElementById("input").value;

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
    API_KEY;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: text
              }
            ]
          }
        ]
      })
    });

    const data = await res.json();

    document.getElementById("output").textContent =
      JSON.stringify(data, null, 2);

  } catch (err) {
    document.getElementById("output").textContent = err;
  }
}
