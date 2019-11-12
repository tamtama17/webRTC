var divSelectRoom = document.getElementById('selectRoom');
var divConsultingRoom = document.getElementById('consultingRoom');
var inputRoomNumber = document.getElementById('roomNumber');
var btnGoRoom = document.getElementById('goRoom');
var localVideo = document.getElementById('localVideo');
var remoteVideo = document.getElementById('remoteVideo');

var roomNumber;
var localSteam;
var remoteStream;
var rtcPeerConnection;

var iceServers = {
	'iceServers':[
		{'url':'stun:stun.services.mozilla.com'},
		{'url':'stun:stun.l.google.com:19320'}
	]
}
var streamConstraints = {audio:true,video:true};
var isCaller;

var socket = io();

btnGoRoom.onclick = function() {
	if (inputRoomNumber.value === '') {
		alert("Please type a room number")
	}else {
		roomNumber = inputRoomNumber.value;
		socket.emit('create or join', roomNumber);
		divSelectRoom.style = "display:none;";
		divConsultingRoom.style = "display:block;";
	}
}

socket.on('created',function(room) {
	navigator.mediaDevice.getUserMedia(streamConstraints).then(function(stream) {
		localSteam = stream;
		localVideo.src = URL.createObjectURL(stream);
		isCaller = treu;
	}).catch(function(err) {
		console.log("An error eccured when accessing media devices");
	});
});

socket.on('joined',function(room) {
	navigator.mediaDevice.getUserMedia(streamConstraints).then(function(stream) {
		localSteam = stream;
		localVideo.src = URL.createObjectURL(stream);
		socket.emit('ready',roomNumber);
	}).catch(function(err) {
		console.log("An error eccured when accessing media devices");
	});
});

socket.on('ready', function() {
	if (isCaller) {
		rtcPeerConnection = new RTCPeerConnection(iceServers);

		rtcPeerConnection.onicecandidate = onIceCandidate;
		rtcPeerConnection.onaddstream = onAddStream;

		rtcPeerConnection.createOffer(setLocalAndOffer, function(e){console.log(e)});
	}
});

socket.on('offer', function(event) {
	if (!isCaller) {
		rtcPeerConnection = new RTCPeerConnection(iceServers);

		rtcPeerConnection.onicecandidate = onIceCandidate;
		rtcPeerConnection.onaddstream = onAddStream;

		rtcPeerConnection.addStream(localSteam);

		rtcPeerConnection.setRemoteDescription(new RTCPeerDescription(event));

		rtcPeerConnection.createAnswer(setLocalAndAnswer, function(e){console.log(e)});

	}
});

socket.on('answer',function(event) {
	rtcPeerConnection.setRemoteDescription(new RTCPeerDescription(event));
});

socket.on('candidate',function(event) {
	var candidate = new RTCIceCandidate({
		sdpMLineIndex: event.label,
		candidate: event.candidate
	});

	rtcPeerConnection.addIceCandidate(candidate);
});

function onAddStream(event) {
	remoteVideo.scr = URL.createObjectURL(event.stream);
	remoteStream = event.stream;
}

function onIceCandidate(event) {
	if (event.candidate) {
		console.log('sending ice candidate');
		socket.emit('candidate',{
			type:'candidate',
			label:event.candidate.sdpMLineIndex,
			id:event.candidate.spdMid,
			candidate:event.candidate.candidate,
			room:roomNumber
		})
	}
}

function setLocalAndOffer(sessionDescription) {
	rtcPeerConnection.setLocalDescription(sessionDescription);
	socket.emit('offer',{
		type:'offer',
		sdp:sessionDescription,
		room:roomNumber
	});
}

function setLocalAndAnswer(sessionDescription) {
	rtcPeerConnection.setLocalDescription(sessionDescription);
	socket.emit('answer'{
		type:'answer',
		sdp:sessionDescription,
		room:roomNumber
	});
}