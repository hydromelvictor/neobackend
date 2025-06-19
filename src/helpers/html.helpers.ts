export function emailToSign(username: string, code: string): string {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Confirmation de compte</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
          color: #333;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: auto;
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
          color: #007bff;
        }
        .code {
          display: inline-block;
          padding: 10px 20px;
          margin-top: 20px;
          background-color: #28a745;
          color: white;
          font-size: 1.5em;
          border-radius: 5px;
          font-weight: bold;
        }
        .footer {
          margin-top: 30px;
          font-size: 0.9em;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Bonjour ${username},</h1>
        <p>Merci de vous être inscrit !</p>
        <p>Pour finaliser votre inscription, veuillez entrer le code de vérification suivant dans l'application :</p>
        <p class="code">${code}</p>
        <p>Si vous n’avez pas demandé cette inscription, vous pouvez ignorer ce message.</p>
        <div class="footer">
          <p>Merci,<br>L’équipe de support</p>
        </div>
      </div>
    </body>
    </html>
  `;
}


export function sending(username: string, code: string): string {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>One-Time-Password</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
          color: #333;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: auto;
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
          color: #007bff;
        }
        .code {
          display: inline-block;
          padding: 10px 20px;
          margin-top: 20px;
          background-color: #28a745;
          color: white;
          font-size: 1.5em;
          border-radius: 5px;
          font-weight: bold;
        }
        .footer {
          margin-top: 30px;
          font-size: 0.9em;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Bonjour ${username},</h1>
        <p>veuillez entrer le code de vérification suivant dans l'application :</p>
        <p class="code">${code}</p>
        <p>Si vous n’avez rien fais necessitant cette action, vous pouvez ignorer ce message.</p>
        <div class="footer">
          <p>Merci,<br>L’équipe de support</p>
        </div>
      </div>
    </body>
    </html>
  `;
}


export function access(username: string, code: string): string {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Code d'accès - Connexion Administrateur</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f7fa;
          color: #333;
          padding: 20px;
        }
        .container {
          max-width: 600px;
          margin: auto;
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #007bff;
        }
        .code {
          display: inline-block;
          padding: 10px 20px;
          margin-top: 20px;
          background-color: #28a745;
          color: white;
          font-size: 1.5em;
          border-radius: 5px;
          font-weight: bold;
        }
        .footer {
          margin-top: 30px;
          font-size: 0.9em;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Bonjour ${username},</h1>
        <p>Nous avons reçu une demande de connexion à votre compte administrateur. Utilisez le code d'accès suivant pour vous connecter :</p>
        <p class="code">${code}</p>
        <p>Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer ce message.</p>
        <div class="footer">
          <p>Merci,<br>L’équipe de support</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
