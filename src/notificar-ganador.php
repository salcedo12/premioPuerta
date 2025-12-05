<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') exit(0);

// IGUAL QUE enviar-cita.php
require 'src/PHPMailer.php';
require 'src/SMTP.php';
require 'src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// NO uses vendor/autoload aquí
// require __DIR__ . '/vendor/autoload.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Método no permitido']);
  exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'JSON inválido']);
  exit;
}

$nombre    = $input['nombre']            ?? '';
$documento = $input['documento']         ?? '';
$telefono  = $input['telefono']          ?? '';
$correo    = $input['correo']            ?? '';
$terreno   = $input['terrenoInteresado'] ?? '';
$ciudad    = $input['ciudad']            ?? '';
$premio    = $input['premio']            ?? '';

try {
  $mail = new PHPMailer(true);

  $mail->isSMTP();
  $mail->Host = 'smtp.gmail.com';
  $mail->SMTPAuth = true;
  $mail->Username = 'sistemas1.meraki@gmail.com';
  $mail->Password = 'ehxm xdxm jcve debj'; 
  $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
  $mail->Port = 587;
  $mail->CharSet = 'UTF-8';

  $mail->setFrom('sistemas1.meraki@gmail.com', 'Juego Meraki');
  $mail->addAddress('sistemas1.meraki@gmail.com', 'Jefe');

$mail->isHTML(true);
$mail->Subject = '🎉 Nuevo ganador del juego Meraki';

$mail->Body = '
  <div style="background:#f3f3f3;padding:20px 0;font-family:Arial,sans-serif;">
    <div style="
      max-width:600px;
      margin:0 auto;
      background:#ffffff;
      border-radius:12px;
      overflow:hidden;
      box-shadow:0 4px 12px rgba(0,0,0,0.08);
    ">
      <div style="background:#ae9638;color:#ffffff;padding:16px 24px;">
        <h2 style="margin:0;font-size:20px;">Nuevo resultado del juego de llaves</h2>
        <p style="margin:4px 0 0;font-size:14px;">Un usuario acaba de jugar en el portal de Grupo Constructor Meraki.</p>
      </div>

      <div style="padding:20px 24px;">
        <h3 style="margin:0 0 12px;font-size:18px;color:#333;">
          Detalles del participante
        </h3>

        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
          <tr>
            <td style="padding:8px 6px;font-weight:bold;color:#555;width:35%;">Nombre</td>
            <td style="padding:8px 6px;color:#222;">'.htmlspecialchars($nombre).'</td>
          </tr>
          <tr style="background:#faf7ee;">
            <td style="padding:8px 6px;font-weight:bold;color:#555;">Documento</td>
            <td style="padding:8px 6px;color:#222;">'.htmlspecialchars($documento).'</td>
          </tr>
          <tr>
            <td style="padding:8px 6px;font-weight:bold;color:#555;">Teléfono</td>
            <td style="padding:8px 6px;color:#222;">'.htmlspecialchars($telefono).'</td>
          </tr>
          <tr style="background:#faf7ee;">
            <td style="padding:8px 6px;font-weight:bold;color:#555;">Correo</td>
            <td style="padding:8px 6px;color:#222;">'.htmlspecialchars($correo).'</td>
          </tr>
          <tr>
            <td style="padding:8px 6px;font-weight:bold;color:#555;">Terreno interesado</td>
            <td style="padding:8px 6px;color:#222;">'.htmlspecialchars($terreno).'</td>
          </tr>
          <tr style="background:#faf7ee;">
            <td style="padding:8px 6px;font-weight:bold;color:#555;">Ciudad</td>
            <td style="padding:8px 6px;color:#222;">'.htmlspecialchars($ciudad).'</td>
          </tr>
          <tr>
            <td style="padding:8px 6px;font-weight:bold;color:#555;">Premio obtenido</td>
            <td style="padding:8px 6px;color:#0b7a2a;font-weight:bold;">'.htmlspecialchars($premio).'</td>
          </tr>
        </table>

        <p style="margin:18px 0 6px;font-size:13px;color:#777;">
          Este mensaje se generó automáticamente desde el juego promocional del portal puertabono.grupoconstructormeraki.com.co.
        </p>
      </div>
    </div>
  </div>
';

  $mail->send();

  echo json_encode(['ok' => true]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => $mail->ErrorInfo]);
}
