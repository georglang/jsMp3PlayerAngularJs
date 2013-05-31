playerApp.controller('PlayerCtrl', ['$scope', function($scope, $timeout) {
		
	$scope.audio = new Audio();
	$scope.audio.src = 'assets/track1.mp3';
	$scope.audio.autoplay = false;
	$scope.audio.controls = true;
	$scope.audio.preload = 'none'; 
	$scope.currentTrackId = 0;
	$scope.tracklistOrder = [];
	$scope.shuffledTracklistOrder = [];
	$scope.shuffle = false;

	var tracks;
	var tracklistOrderIndex = 0;

	//======= private ========

		setTrackSource = function (){
		$scope.audio.src = tracks[$scope.getCurrentTrackId()].url;
		$scope.audio.autoplay = true;
		$scope.changeTrackMark();	
	}

	//======= controller ========

	$scope.audio.addEventListener('play', function(e) {
			$scope.changeTrack();
	});

	$scope.audio.addEventListener('timeupdate', function(e) {
			$scope.timeUpdate($scope.audio.currentTime);
	});

	$scope.audio.addEventListener('durationchange', function(e) {
			$scope.durationChange();
	});

	$scope.audio.addEventListener('ended', function(e) {
     	$scope.nextTrack();
   	});

	$scope.getTracklist = function(){
		$.ajaxSetup({ async: false });
        
       	$.getJSON('assets/tracklist.json', function(data) {
		 	tracks = data.tracks; //objektArray tracks
		 	console.log(tracks);

		 	for(var i=0;i<tracks.length; i++){
		 		tracks[i].id = i;
		 		$scope.tracklistOrder[i] = i; //id wird in gleicher ordnung eingefügt
		 	}

		 	$scope.setCurrentTrackIdIndexOrder(0);
		 	$scope.audio.pause();
		});	
	}

	$scope.setCurrentTrackId = function (currentTrackId){
		$scope.currentTrackId = currentTrackId;
		tracklistOrderIndex = $scope.tracklistOrder.indexOf(currentTrackId); //indexOf durchsucht array nach index
		setTrackSource();
	}

	//setzen des Indexes, des aktuellen tracks
	$scope.setCurrentTrackIdIndexOrder = function(currentTracklistOrderIndex) {
		tracklistOrderIndex = currentTracklistOrderIndex;
		console.log("SCOPE SHUFFLE", $scope.shuffle);
		if($scope.shuffle){
			$scope.currentTrackId = $scope.shuffledTracklistOrder[currentTracklistOrderIndex];
		}
		else{
			$scope.currentTrackId = $scope.tracklistOrder[currentTracklistOrderIndex]; //fragt aktuelle id ab
		}
		
		setTrackSource();
	}

	$scope.getCurrentTrackId = function (){
		return $scope.currentTrackId;
	}

	$scope.moveTrackInList = function(fromIndex, toIndex){
		// schneidet element an position fromIndex aus und speichert Element, dass ausgeschnitten wurde
		var cutOutElement = $scope.tracklistOrder.splice(fromIndex, 1)[0];
		
		// fuegt ausgeschnittens element an position toIndex ein
		$scope.tracklistOrder.splice(toIndex, 0, cutOutElement);

		// wenn der aktuell abgespielte Track bewegt wurde, muss dieser tracklistOrderIndex im Model aktualisiert werden.2
		if (fromIndex == tracklistOrderIndex){
			tracklistOrderIndex = toIndex;
		}
	}

	$scope.getTrackTitle = function(){
		return tracks[$scope.getCurrentTrackId()].title;
	}

	$scope.getTrackTitleById = function (id){
		return tracks[id].title;
	}
	
	$scope.getTrackArtist = function(){
		return tracks[$scope.getCurrentTrackId()].artist;
	}

	$scope.getTrackGenre = function(){
		return tracks[$scope.getCurrentTrackId()].genre;
	}

	$scope.getTrackAlbum = function(){
		return tracks[$scope.getCurrentTrackId()].artist;
	}
	
	$scope.play = function(){
	    $scope.audio.play();
	}

	$scope.pause = function(){
        $scope.audio.pause();
	}

	$scope.stop = function(){
        $scope.audio.pause();
    	$scope.audio.currentTime = 0.0;
	}

	$scope.nextTrack = function(){
		var lastTrack = false;
		var currentTracklistOrderIndex = tracklistOrderIndex;
		currentTracklistOrderIndex++;
		
		//setzen von lastTrack um nach letztem track zu stoppen
		if(currentTracklistOrderIndex >= tracks.length){
			lastTrack = true;
		}

		currentTracklistOrderIndex = currentTracklistOrderIndex % tracks.length; //tracks fangen nach Tracklistende wieder von vorne an
		$scope.setCurrentTrackIdIndexOrder(currentTracklistOrderIndex);	
	}

	$scope.prevTrack = function(){
		var currentTracklistOrderIndex = tracklistOrderIndex;
		currentTracklistOrderIndex--;
		
		while(currentTracklistOrderIndex < 0) //wenn unter 0 wird listenlaenge aufaddiert
			currentTracklistOrderIndex += tracks.length;
			$scope.setCurrentTrackIdIndexOrder(currentTracklistOrderIndex);
	}

	$scope.changeVolume = function(volume){
		$scope.audio.volume = volume;
	}
}]);