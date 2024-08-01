import mysql from "mysql2/promise"; // Use mysql2 for async/await
import AWS from "aws-sdk";

// Ensure environment variables are loaded
console.log("Database Host:", process.env.DB_HOST);
console.log("AWS Region:", process.env.REGION);
console.log("SNS Topic ARN:", process.env.SNS_TOPIC_ARN);

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const sns = new AWS.SNS({ region: process.env.REGION });

export async function handler(event) {
  const connection = await mysql.createConnection(dbConfig);

  try {
    // const [results] = await connection.execute(`
    //   SELECT e.event_name, e.event_date, e.notification_time, u.email
    //   FROM events e
    //   JOIN users u ON e.user_id = u.id
    //   WHERE e.notification_time >= NOW() + INTERVAL 12 HOUR AND e.notification_time > NOW()
    // `);

    const [results] = await connection.execute(`
      SELECT e.event_name, e.event_date, u.email
      FROM events e
      JOIN users u ON e.user_id = u.id
      WHERE e.event_date = CURDATE() OR e.event_date = CURDATE() + INTERVAL 1 DAY;
    `);
    // Log the results for debugging
    console.log("Query Results:", results);

    if (!Array.isArray(results)) {
      throw new TypeError("Query results are not in expected format.");
    }

    const notifications = results.map((event) => {
      const params = {
        Message: `Reminder: Your event "${event.event_name}" is coming up on ${event.event_date}`,
        Subject: `Event Reminder: ${event.event_name}`,
        TopicArn: process.env.SNS_TOPIC_ARN,
      };

      return sns.publish(params).promise();
    });

    await Promise.all(notifications);
    console.log("All notifications sent successfully");
  } catch (err) {
    console.error("Error querying events or sending notifications:", err);
  } finally {
    await connection.end();
  }
}
