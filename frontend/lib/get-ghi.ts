"use server";

export async function getGHI() {
  try {
    const fortyguard_url = "https://api.fortyguard.com/v1/env_params";

    const response = await fetch(fortyguard_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
        "api-key": process.env.FORTYGUARD_API_KEY!,
      },
      body: JSON.stringify({
        latitude: 40.7128,
        longitude: -74.006,
        temperature: 10,
        date_time: {
          start_date: "2024-07-15",
          start_time: "14:00",
          filter_type: 1,
        },
      }),
    })

    if(!response.ok){
        console.log('headers:')
        console.log("response error:", await response.text())
        return new Error("Error from fortyguard")
    }

    const data = await response.json()
    console.log("data from GHI", data)
    return data

  } catch (error) {
    console.log("error from getGHI", error);
  }

}
