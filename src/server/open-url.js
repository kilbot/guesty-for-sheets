/**
 * Opens the URL by using a temporary HTML dialogue environment that closes after the url has been
 * opened. If the URL could not open, information text appears in the dialog and the dialog stays open.
 * @param {String} the URL to open.
 *
 */
export function openUrl(url) {
  const blob = `
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons1.css">
  </head>
  
  <body>
  <div id="blocked" hidden>
    <p><a href="${url}"onclick="window.open(this.href)" rel="nofollow noopener">Go to link!</a></p>
    <p>Hey there! You have popups blocked for Google Workspace Docs so you will have to click the link above.</p>
    <p>You can always remove the popup block for next time. 👍</p>
    <button onclick="google.script.host.close()">Close</button>
  </div>
 
    <script>
      
      const urlLinked = window.open("${url}");
      if(urlLinked){
        google.script.host.close()
      }else{
        document.getElementById("blocked").hidden = false;
      }
    
    </script>
  </body>
</html>
`;

  const html = HtmlService.createHtmlOutput(blob).setWidth(400).setHeight(200);

  const ui = SpreadsheetApp.getUi();

  ui.showModalDialog(html, 'Link');
}
