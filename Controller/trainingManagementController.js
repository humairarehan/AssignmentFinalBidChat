import moment from 'moment';


export function getTrainingSessionDetails(trainingData,res) {
    //total is the summation of the durations of each members to be trained
    //count to decide the end index of the Tracks
    let total = 0;

    let count = 0;
    //trackIndexArray is the array where we store the end index of each Track 
	let trackIndexArray = [];
	let availaibleSlots=[]
    //Morning Shift Logic to find all the available time slots available in training data array
     availaibleSlots = subset_sum(trainingData, 180);
    if (availaibleSlots) {
		//Rearrange the training data array to best fit the 180 min morning shift
		for (let k = 0; k < availaibleSlots.length; k++) {
			trainingData.move(availaibleSlots[k] - 1, 0)
		}
	}
    flag = true;

    //Loop through the traing data to separate out the Tracks
    for (let i = 0; i < trainingData.length; i++) {
		if (isNaN(parseInt(trainingData[i].duration))) {
			continue;
		}

		total += parseInt(trainingData[i].duration);

		count++;

		/*
		 check with 420 (As 9AM to 5PM is 8 hours 8*60=480  480-60(Lunch Time)=420)
		 This determines the end index of Track from Training Data array
		*/
		if (total >= 420) {
			trackIndexArray.push({ index: count })
			let availaibleSlotsAfterTrackEnd =[]
			availaibleSlotsAfterTrackEnd = subset_sum(trainingData.slice(i), 180);
			console.log(`Avalaible track End:: ${availaibleSlotsAfterTrackEnd}`)
			flag = true;
			if (availaibleSlotsAfterTrackEnd) {
				//Rearrange the training data  array to best fit the 180 min morning shift
				for (let k = 0; k < availaibleSlotsAfterTrackEnd.length; k++) {
					trainingData.move(availaibleSlotsAfterTrackEnd[k]-1, count)
				}
			}

			//Reset the total and count variable after each track
			total = 0
			count = 0
		}
		//Condition for the last track remaining that doesn't satisfy 420min condition
		if (i == trainingData.length - 1) {
			trackIndexArray.push({ index: count })
		}
	}

    TrackWiseTrainingSlots(trackIndexArray, trainingData,res)
}
function TrackWiseTrainingSlots(trackIndexArray, trainingData,res) {
    let timeTotal = 0;
    let trackindex = 0;
    let response = [];
    for (let i = 0; i < trackIndexArray.length; i++) {
		console.log("Track ", i + 1)
		let trackwiseTrainingData = [];
		//Loop for Tracks	
		for (let j = 0; j < Number(trackIndexArray[i].index); j++) {
			//Lunch time check
			if (moment("2015-01-16T09:00:00").add(timeTotal, 'm').format("hh:mm a") == "12:00 pm") {
				console.log(moment("2015-01-16T09:00:00").add(timeTotal, 'm').format("hh:mm a"), "Lunch Break", "60 mins");
				
				trackwiseTrainingData.push({time:moment("2015-01-16T09:00:00").add(timeTotal, 'm').format("hh:mm a").toString(),
				name:"Lunch",
				duration:""})
				timeTotal = timeTotal + 60
				j--;
				continue
			} else if (trainingData[trackindex]) {
				//normal time slot addition
				console.log(moment("2015-01-16T09:00:00").add(timeTotal, 'm').format("hh:mm a"), trainingData[trackindex].name, parseInt(trainingData[trackindex].duration));
				
				trackwiseTrainingData.push(
					{
					time:moment("2015-01-16T09:00:00").add(timeTotal, 'm').format("hh:mm a").toString(),
					name:trainingData[trackindex].name,
					duration:trainingData[trackindex].duration
				})
			}
			//check if the duration is Not a number add it as team break of 5 Mins
			if (trainingData[trackindex] && isNaN(parseInt(trainingData[trackindex].duration))) {
				timeTotal = timeTotal + 5
				trackindex++
				continue;
			}
			//Normal time summation
			if (trainingData[trackindex]) {
				timeTotal += parseInt(trainingData[trackindex].duration);
			}
			trackindex++
			//Last record of the training data to be added to the array
			if (trackindex == trainingData.length - 1) {
				
				console.log(moment("2015-01-16T09:00:00").add(timeTotal, 'm').format("hh:mm a"), trainingData[trackindex].name, parseInt(trainingData[trackindex].duration,"ttttt"));
			
				trackwiseTrainingData.push(
					{
					time:moment("2015-01-16T09:00:00").add(timeTotal, 'm').format("hh:mm a").toString(),
					name:trainingData[trackindex].name,
					duration:trainingData[trackindex].duration
				})
			}
			//Reporting Login
			if (j == Number(trackIndexArray[i].index) - 1) {
				if (timeTotal >= 420) {
					if (trackindex == trainingData.length - 1) {
						timeTotal += parseInt(trainingData[trackindex].duration);

					}
					console.log(moment("2015-01-16T09:00:00").add(timeTotal, 'm').format("hh:mm a"), "Reporting", "");
				
					trackwiseTrainingData.push(
						{
						time:moment("2015-01-16T09:00:00").add(timeTotal, 'm').format("hh:mm a").toString(),
						name:"Reporting",
						duration:""
					})
				}
				timeTotal = 0
			}
		}
		response.push(trackwiseTrainingData)
		
	}
	res.send(response)
}
let obj = [];
let flag = true;
function subset_sum(numbers, target, partial, index) {
    let s;
    let n;
    let j;
    let remaining;
    obj = []

    partial = partial || []
    index = index || []
    s = partial.reduce((a, b) => a + b, 0)

    if (s > target) {
		return null
	}

    // check if the partial sum is equals to target
    if (s === target) {
		obj = {
			index:index
		}
		partial = []
		index = []
		flag = false;
	}
    for (let i = 0; i < numbers.length; i++) {
		n = parseInt(numbers[i].duration)
		j = numbers[i].id
		remaining = numbers.slice(i + 1)
		if (flag) {
            
			subset_sum(remaining, target, partial.concat([n]), index.concat([j]))
		}
		else {
			break;
		}
	}
    return obj.index
}

//track logic 9:00 AM to 5:00 PM 8 hours i.e 8*60 =480 mins

//for morning seession all the possiblities

Array.prototype.move = function (from, to) {
	this.splice(to, 0, this.splice(from, 1)[0]);
};