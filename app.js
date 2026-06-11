async function getWeather() {
  const city = document.getElementById("city").value.trim();
  if (!city) {
    alert("Please enter a city name!");
    return;
  }

  const weatherApiKey = "key"; 
  const openAiKey = "key";

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${weatherApiKey}&units=metric`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.cod != 200) {
      document.getElementById("weather").innerText = "❌ City not found!";
      document.getElementById("aiSuggestion").innerText = "";
      return;
    }
    const temp = data.main.temp;
    const weather = data.weather[0].description;
    document.getElementById("weather").innerHTML = `🌍 <b>${data.name}</b>: ${temp}°C, ${weather}`;

    //AI suggestion
    const aiPrompt = `The weather in ${data.name} is ${temp}°C with ${weather}. Give a short, fun 1-sentence suggestion.`;

    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openAiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: aiPrompt }]
      })
    });

    const aiData = await aiResponse.json();

    if (aiData.choices?.length) {
      document.getElementById("aiSuggestion").innerText = "🤖 " + aiData.choices[0].message.content;
    } else {
      document.getElementById("aiSuggestion").innerText = "⚠️ AI suggestion not available.";
    }
  } catch (err) {
    document.getElementById("weather").innerText = "⚠️ Error fetching weather!";
    console.error(err);
  }
}
