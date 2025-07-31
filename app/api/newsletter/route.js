export async function POST(request) {
  try {
    const { email, name } = await request.json();

    // Validate the input
    if (!email || !name) {
      return new Response(
        JSON.stringify({ error: "Email and name are required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // TODO: Add your newsletter service integration here
    // Example: Mailchimp, SendGrid, etc.
    
    // For now, we'll just simulate a successful subscription
    return new Response(
      JSON.stringify({ message: "Successfully subscribed to newsletter" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
