<?php

header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Thu, 1 Jan 1970 01:00:00 GMT"); // Date in the past
header('Content-type: application/json');

$ot = (object) array();
$ot->cmd = "/home/nathan/.nave/installed/0.10.31/bin/node";
$ot->user = $_SERVER['PHP_AUTH_USER'];

// Require user to be logged in and with a name more than 3 characters long
if (empty($ot->user) || strlen($ot->user) < 4) {
	$ot->error = 'NOT GOD';
	$ot->result = false;
	echo json_encode($ot);
	exit(1);
}

$ot->result = true;
$ot->script = $_POST['script'];
$ot->content = $_POST['content'];
$ot->content64 = $_POST['content64'];
$ot->data = '';
$ot->error = '';

if (!empty($ot->content64)) {
	$ot->content = base64_decode($ot->content64);
}

$ot->cmd .= ' ' . $ot->script;
$chunk_size = 1400;
$read_a = null;
$write_a = null;
$error_a = null;

$descriptorspec = array(
   0 => array("pipe", "r"),  // stdin
   1 => array("pipe", "w"),  // stdout
   2 => array("pipe", "w")   // stderr
);

$process = proc_open($ot->cmd, $descriptorspec, $pipes);

if (!is_resource($process)) {
	$ot->error = "ERROR: Can't spawn shell";
	$ot->result = false;
	echo json_encode($ot);
	exit(1);
}

stream_set_blocking($pipes[0], 0);
stream_set_blocking($pipes[1], 0);
stream_set_blocking($pipes[2], 0);

// Send content to node process STDIN
if (!empty($ot->content)) {
	fwrite($pipes[0], $ot->content);
	fflush($pipes[0]);
	fclose($pipes[0]);
}

while (1) {
		// Check for end of STDOUT or STDERR
	if (feof($pipes[1]) || feof($pipes[2])) {
		break;
	}

	// Wait for output on stdout or stderr
	$read_a = array($pipes[1], $pipes[2]);
	$num_changed_sockets = stream_select($read_a, $write_a, $error_a, null);

	// Rread from the process's STDOUT
	if (in_array($pipes[1], $read_a)) {
		$ot->data .= fread($pipes[1], $chunk_size);
	}

	// Rread from the process's STDERR
	if (in_array($pipes[2], $read_a)) {
		$ot->error .= fread($pipes[2], $chunk_size);
	}
}

if (!empty($ot->error)) {
	$ot->result = false;
}

if (empty($ot->content))
	fclose($pipes[0]);
fclose($pipes[1]);
fclose($pipes[2]);
proc_close($process);

echo json_encode($ot);
