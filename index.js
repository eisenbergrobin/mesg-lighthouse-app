const mesg = require("mesg-js").application();
const URL = require("url").URL;

/**
 * This application is called from a webhook.
 * When triggered, it performs a lighthouse audit of the given url
 * and displays the results on an HTTP webserver as an HTML page.
 *
 * For example, can be triggered as part of a CI job to test against
 * performance regressions on a website.
 */
async function runAudit(url) {
  const result = await mesg.executeTaskAndWaitResult({
    serviceID: "mesg-lighthouse",
    taskKey: "runLighthouseAudit",
    inputData: JSON.stringify({ url })
  });
  const uri = new URL(url);
  const route = `report-${uri.hostname.replace(".", "-")}`;
  const htmlBody = JSON.parse(result.outputData).htmlResults;
  const routeAddResult = await mesg.executeTaskAndWaitResult({
    serviceID: "mesg-http",
    taskKey: "addRoute",
    inputData: JSON.stringify({ route, htmlBody })
  });
  return route;
}

mesg
  .listenEvent({
    serviceID: "webhook",
    eventFilter: "request"
  })
  .on("data", async event => {
    // Event should be { task: "lighthouse", url: "https://my-url-to-analyze" }
    const data = JSON.parse(event.eventData).data;
    const { task, url } = data;
    if (task === "lighthouse" && url) {
      try {
        // Run the audit and generate the report
        const route = await runAudit(url);
        console.log(
          `Audit complete and available @ http://localhost:8080/${route}`
        );
      } catch (error) {
        console.error(
          "An error occurred while executing the send task:",
          error.message
        );
      }
      return;
    }
    console.log(
      'Webhook skipped, task not handled. This application responds to a { task: "lighthouse", url: "https://my-url-to-analyze" } payload.'
    );
  })
  .on("error", error => {
    console.error(
      "An error occurred while listening the request events:",
      error.message
    );
  });

console.log("Lighthouse application is running and listening for events!");
