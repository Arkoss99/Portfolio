<?php
$TO_EMAIL = 'milanzlamal@post.cz'; 
$FROM_NAME = 'Portfolio Contact - Website';

function respond($ok, $msg=''){
  $query = http_build_query(['status' => $ok ? 'ok' : 'error', 'msg' => $msg]);
  header('Location: index.html?'.$query.'#contact');
  exit;
}

if($_SERVER['REQUEST_METHOD'] !== 'POST'){
  respond(false, 'Invalid request.');
}


if(!empty($_POST['company'])){
  respond(true); 
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');

if($name === '' || $email === '' || $message === ''){
  respond(false, 'Please fill in all fields.');
}
if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
  respond(false, 'Please enter a valid email address.');
}

$subject = "New message from $name";
$body = "Name: $name\nEmail: $email\nIP: ".($_SERVER['REMOTE_ADDR'] ?? 'unknown')."\n\n".$message;
$headers = "From: $FROM_NAME <no-reply@".$_SERVER['SERVER_NAME'].">\r\n".
           "Reply-To: $name <$email>\r\n".
           "X-Mailer: PHP/".phpversion();

$sent = @mail($TO_EMAIL, $subject, $body, $headers);
if($sent){
  respond(true, 'Thanks! Your message was sent.');
}
respond(false, 'Could not send email. Please try again later.');
?>