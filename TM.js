//------------------------------
	var s = 4.2;
	var T = 20;
	var epochs = 15;
	// Code speed at start (ms)
	var speed = 4000;
//------------------------------

// Global TM defs (small XOR problem so easier this way)
var features = 2;
var literals = features*2;
var classes = 2
var number_of_clauses = 4;
var examples = 4;
var TM_clauses = [0, 0, 0, 0];
var TM_clauses_polarity = [0, 0, 0, 0];
var fb4_clauses = new Array(number_of_clauses);
var TA_states = new Array(literals*number_of_clauses);
var number_of_states = 2;
var predict = 0;
var PREDICT = 1;
var BOOST_TRUE_POSITIVE_FEEDBACK = 0; 

// input data
let X = [[0,0],[0,1],[1,0],[1,1]];
let X_hat = [[1,1],[1,0],[0,1],[0,0]];
var y = [0, 1, 1, 0];

//controlling speed of the training
function sleep(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}

function action(state){
	if(state <= number_of_states){
		return 0;
	}
	else{
		return 1;
	}
}

function getRand(){
	return Math.random();
}

function type_ii_feedback(example_index, X, clause){
	console.log("type_ii_feedback");
	// if(TM_clauses[clause] < 0) TM_clauses[clause] *= -1;
	var action_include; 
	var action_include_negated; 
	if(TM_clauses[clause] == 1){
		for(let k = 0; k < features; k++){
			action_include = action(TA_states[0 + (k*2) +(clause*features*2)]);
			action_include_negated = action(TA_states[1 + (k*2) +(clause*features*2)]);

			if(action_include == 0 && TA_states[0 + (k*2) +(clause*features*2)] < 4 && (X[example_index][k] == 0)){
				var prev_state;
				var new_state;
				var str_TA = "c";
				var str_fb = "fb_c";
				// remove the dot from the old TA 
				str_TA = str_TA.concat((clause).toString());
				str_fb = str_fb.concat((clause).toString());
				str_TA = str_TA.concat("_X");
				str_TA = str_TA.concat((k).toString());
				str_TA = str_TA.concat("_TA_");
				str_fb = str_fb.concat("_x");
				str_fb = str_fb.concat((k).toString());
				str_TA_prev = str_TA.concat((TA_states[0 + (k*2) +(clause*features*2)]).toString());
				console.log(str_TA_prev);
				if(TA_states[0 + (k*2) + (clause*features*2)] <=2){
					prev_state = 0;
					if(TA_states[0 + (k*2) +(clause*features*2)] == 0){
						document.getElementById(str_TA_prev).style.backgroundImage ="url(images/bottom.gif)" ;
					}
					else{
						document.getElementById(str_TA_prev).style.backgroundImage ="url(images/m-b.gif)" ;
					}	
				}
				else{
					prev_state = 1;
					if(TA_states[0 + (k*2) +(clause*features*2)] == 5){
						document.getElementById(str_TA_prev).style.backgroundImage ="url(images/top.gif)" ;
					}
					else{
						document.getElementById(str_TA_prev).style.backgroundImage ="url(images/m-p.gif)" ;
					}

				}
				// Transition the TA
				TA_states[0 + (k*2) +(clause*features*2)] = TA_states[0 + (k*2) +(clause*features*2)] + 1;
				str_TA_new = str_TA.concat((TA_states[0 + (k*2) +(clause*features*2)]).toString());
				console.log(str_TA_new);
				if(TA_states[0 + (k*2) + (clause*features*2)] <=2){
					new_state = 0;
					if(TA_states[0 + (k*2) +(clause*features*2)] == 0){
						
						document.getElementById(str_TA_new).style.backgroundImage ="url(images/bottom-f.gif)" ;
					}
					else{
						document.getElementById(str_TA_new).style.backgroundImage ="url(images/m-b-f.gif)" ;
					}	
				}
				else{
					new_state = 1;
					if(TA_states[0 + (k*2) +(clause*features*2)] == 5){
						document.getElementById(str_TA_new).style.backgroundImage ="url(images/top-f.gif)" ;
					}
					else{
						document.getElementById(str_TA_new).style.backgroundImage ="url(images/m-p-f.gif)" ;
					}

				}
				if(prev_state == 0 && new_state == 1){
					document.getElementById(str_fb).innerHTML = "P";
				}
				else if(prev_state == 1 && new_state == 0){
					document.getElementById(str_fb).innerHTML = "P";
				}
				else if(prev_state == 1 && new_state == 1 || (prev_state == 0 && new_state == 0)){
					document.getElementById(str_fb).innerHTML = "R";
				}					
			} 
			if(action_include_negated == 0 && TA_states[1 + (k*2) +(clause*features*2)] < 4 && (X[example_index][k] == 1)){
				var prev_state_2;
				var new_state_2;
				var str_TA = "c";
				var str_fb = "fb_c";
				// remove the dot from the old TA 
				str_TA = str_TA.concat((clause).toString());
				str_fb = str_fb.concat((clause).toString());
				str_TA = str_TA.concat("_X");
				str_TA = str_TA.concat((k).toString());
				str_TA = str_TA.concat("_bar_TA_");
				str_fb = str_fb.concat("_x");
				str_fb = str_fb.concat((k).toString());
				str_TA_prev = str_TA.concat((TA_states[1 + (k*2) +(clause*features*2)]).toString());
				console.log(str_TA_prev);
				if(TA_states[1 + (k*2) + (clause*features*2)] <=2){
					prev_state_2 = 0;
					if(TA_states[1 + (k*2) +(clause*features*2)] == 0){
						document.getElementById(str_TA_prev).style.backgroundImage ="url(images/bottom.gif)" ;
					}
					else{
						document.getElementById(str_TA_prev).style.backgroundImage ="url(images/m-b.gif)" ;
					}	
				}
				else{
					prev_state_2 = 1;
					if(TA_states[1 + (k*2) +(clause*features*2)] == 5){
						document.getElementById(str_TA_prev).style.backgroundImage ="url(images/top.gif)" ;
					}
					else{
						document.getElementById(str_TA_prev).style.backgroundImage ="url(images/m-p.gif)" ;
					}

				}
				// Transition the TA
				TA_states[1 + (k*2) +(clause*features*2)] = TA_states[1 + (k*2) +(clause*features*2)] + 1;
				str_TA_new = str_TA.concat((TA_states[1 + (k*2) +(clause*features*2)]).toString());
				console.log(str_TA_new);
				if(TA_states[1 + (k*2) + (clause*features*2)] <=2){
					new_state_2 = 0;
					if(TA_states[1 + (k*2) +(clause*features*2)] == 0){
						document.getElementById(str_TA_new).style.backgroundImage ="url(images/bottom-f.gif)" ;
					}
					else{
						document.getElementById(str_TA_new).style.backgroundImage ="url(images/m-b-f.gif)" ;
					}	
				}
				else{
					new_state_2 = 1;
					if(TA_states[1 + (k*2) +(clause*features*2)] == 5){
						document.getElementById(str_TA_new).style.backgroundImage ="url(images/top-f.gif)" ;
					}
					else{
						document.getElementById(str_TA_new).style.backgroundImage ="url(images/m-p-f.gif)" ;
					}

				}
				str_fb = str_fb.concat("b");
				if(prev_state_2 == 0 && new_state_2 == 1){
					document.getElementById(str_fb).innerHTML = "P";
				}
				else if(prev_state_2 == 1 && new_state_2 == 0){
					document.getElementById(str_fb).innerHTML = "P";
				}
				else if(prev_state_2 == 1 && new_state_2 == 1 || (prev_state_2 == 0 && new_state_2 == 0)){
					document.getElementById(str_fb).innerHTML = "R";
				}	

			}
		}
	}
}

function type_i_feedback(example_index, X, clause){
	
	// if(TM_clauses[clause] < 0) TM_clauses[clause] *= -1;
	console.log("type_i_feedback");
	console.log(TM_clauses[clause]);

	if(TM_clauses[clause] == 0){
		// REWARD 
		for(let k = 0; k < features; k++){
			var rand = getRand();
			// if TA is exclude and rand <= (1/s)
			if(TA_states[0 + (k*2) +(clause*features*2)] > 0 && (rand <= (1.0/s))){
				var prev_state;
				var new_state;
				var str_TA = "c";
				var str_fb = "fb_c";
				// remove the dot from the old TA 
				str_TA = str_TA.concat((clause).toString());
				str_fb = str_fb.concat((clause).toString());
				str_TA = str_TA.concat("_X");
				str_TA = str_TA.concat((k).toString());
				str_TA = str_TA.concat("_TA_");
				str_fb = str_fb.concat("_x");
				str_fb = str_fb.concat((k).toString());
				str_TA_prev = str_TA.concat((TA_states[0 + (k*2) +(clause*features*2)]).toString());
				console.log(str_TA_prev);
				if(TA_states[0 + (k*2) + (clause*features*2)] <=2){
					prev_state = 0;
					if(TA_states[0 + (k*2) +(clause*features*2)] == 0){
						document.getElementById(str_TA_prev).style.backgroundImage ="url(images/bottom.gif)" ;
					}
					else{
						document.getElementById(str_TA_prev).style.backgroundImage ="url(images/m-b.gif)" ;
					}	
				}
				else{
					prev_state = 1;
					if(TA_states[0 + (k*2) +(clause*features*2)] == 5){
						document.getElementById(str_TA_prev).style.backgroundImage ="url(images/top.gif)" ;
					}
					else{
						document.getElementById(str_TA_prev).style.backgroundImage ="url(images/m-p.gif)" ;
					}

				}
				// Transition the TA
				TA_states[0 + (k*2) +(clause*features*2)] =TA_states[0 + (k*2) +(clause*features*2)] - 1;
				str_TA_new = str_TA.concat((TA_states[0 + (k*2) +(clause*features*2)]).toString());
				console.log(str_TA_new);
				if(TA_states[0 + (k*2) + (clause*features*2)] <=2){
					new_state = 0;
					if(TA_states[0 + (k*2) +(clause*features*2)] == 0){
						
						document.getElementById(str_TA_new).style.backgroundImage ="url(images/bottom-f.gif)" ;
					}
					else{
						document.getElementById(str_TA_new).style.backgroundImage ="url(images/m-b-f.gif)" ;
					}	
				}
				else{
					new_state = 1;
					if(TA_states[0 + (k*2) +(clause*features*2)] == 5){
						document.getElementById(str_TA_new).style.backgroundImage ="url(images/top-f.gif)" ;
					}
					else{
						document.getElementById(str_TA_new).style.backgroundImage ="url(images/m-p-f.gif)" ;
					}

				}
				if(prev_state == 0 && new_state == 1){
					document.getElementById(str_fb).innerHTML = "P";
				}
				else if(prev_state == 1 && new_state == 0){
					document.getElementById(str_fb).innerHTML = "P";
				}
				else if(prev_state == 1 && new_state == 1 || (prev_state == 0 && new_state == 0)){
					document.getElementById(str_fb).innerHTML = "R";
				}		
			}
			rand = getRand();
			if(TA_states[1 + (k*2) +(clause*features*2)] > 0 && (rand <= (1.0/s))){
				var prev_state_2;
				var new_state_2;
				var str_TA = "c";
				var str_fb = "fb_c";
				// remove the dot from the old TA 
				str_TA = str_TA.concat((clause).toString());
				str_fb = str_fb.concat((clause).toString());
				str_TA = str_TA.concat("_X");
				str_TA = str_TA.concat((k).toString());
				str_TA = str_TA.concat("_bar_TA_");
				str_fb = str_fb.concat("_x");
				str_fb = str_fb.concat((k).toString());
				str_TA_prev = str_TA.concat((TA_states[1 + (k*2) +(clause*features*2)]).toString());
				console.log(str_TA_prev);
				if(TA_states[1 + (k*2) + (clause*features*2)] <=2){
					prev_state_2 = 0;
					if(TA_states[1 + (k*2) +(clause*features*2)] == 0){
						document.getElementById(str_TA_prev).style.backgroundImage ="url(images/bottom.gif)" ;
					}
					else{
						document.getElementById(str_TA_prev).style.backgroundImage ="url(images/m-b.gif)" ;
					}	
				}
				else{
					prev_state_2 = 1;
					if(TA_states[1 + (k*2) +(clause*features*2)] == 5){
						document.getElementById(str_TA_prev).style.backgroundImage ="url(images/top.gif)" ;
					}
					else{
						document.getElementById(str_TA_prev).style.backgroundImage ="url(images/m-p.gif)" ;
					}

				}
				// Transition the TA
				TA_states[1 + (k*2) +(clause*features*2)] = TA_states[1 + (k*2) +(clause*features*2)] - 1;
				str_TA_new = str_TA.concat((TA_states[1 + (k*2) +(clause*features*2)]).toString());
				console.log(str_TA_new);
				if(TA_states[1 + (k*2) + (clause*features*2)] <=2){
					new_state_2 = 0;
					if(TA_states[1 + (k*2) +(clause*features*2)] == 0){
						document.getElementById(str_TA_new).style.backgroundImage ="url(images/bottom-f.gif)" ;
					}
					else{
						document.getElementById(str_TA_new).style.backgroundImage ="url(images/m-b-f.gif)" ;
					}	
				}
				else{
					new_state_2 = 1;
					if(TA_states[1 + (k*2) +(clause*features*2)] == 5){
						document.getElementById(str_TA_new).style.backgroundImage ="url(images/top-f.gif)" ;
					}
					else{
						document.getElementById(str_TA_new).style.backgroundImage ="url(images/m-p-f.gif)" ;
					}

				}
				str_fb = str_fb.concat("b");
				if(prev_state_2 == 0 && new_state_2 == 1){
					document.getElementById(str_fb).innerHTML = "P";
				}
				else if(prev_state_2 == 1 && new_state_2 == 0){
					document.getElementById(str_fb).innerHTML = "P";
				}
				else if(prev_state_2 == 1 && new_state_2 == 1 || (prev_state_2 == 0 && new_state_2 == 0)){
					document.getElementById(str_fb).innerHTML = "R";
				}				
			}

		} //features 
	}//clause = 0
	if(TM_clauses[clause] == 1){
		for(let k = 0; k < features; k++){
			if(X[example_index][k] == 1){
				var rand = getRand();
				if((TA_states[0 + (k*2) +(clause*features*2)] < 5) && (BOOST_TRUE_POSITIVE_FEEDBACK == 1 || rand <= (s-1)/s)){
					var prev_state;
					var new_state;
					str_TA = "c";
					str_fb = "fb_c";
					// remove the dot from the old TA 
					str_TA = str_TA.concat((clause).toString());
					str_fb = str_fb.concat((clause).toString());
					str_TA = str_TA.concat("_X");
					str_TA = str_TA.concat((k).toString());
					str_TA = str_TA.concat("_TA_");
					str_fb = str_fb.concat("_x");
					str_fb = str_fb.concat((k).toString());
					str_TA_prev = str_TA.concat((TA_states[0 + (k*2) +(clause*features*2)]).toString());
					console.log(str_TA_prev);
					if(TA_states[0 + (k*2) + (clause*features*2)] <=2){
						prev_state = 0;
						if(TA_states[0 + (k*2) +(clause*features*2)] == 0){
							document.getElementById(str_TA_prev).style.backgroundImage ="url(images/bottom.gif)" ;
						}
						else{
							document.getElementById(str_TA_prev).style.backgroundImage ="url(images/m-b.gif)" ;
						}	
					}
					else{
						prev_state = 1;
						if(TA_states[0 + (k*2) +(clause*features*2)] == 5){
							document.getElementById(str_TA_prev).style.backgroundImage ="url(images/top.gif)" ;
						}
						else{
							document.getElementById(str_TA_prev).style.backgroundImage ="url(images/m-p.gif)" ;
						}

					}
					// Transition the TA
					TA_states[0 + (k*2) +(clause*features*2)] =TA_states[0 + (k*2) +(clause*features*2)] + 1;
					str_TA_new = str_TA.concat((TA_states[0 + (k*2) +(clause*features*2)]).toString());
					console.log(str_TA_new);
					if(TA_states[0 + (k*2) + (clause*features*2)] <=2){
						new_state = 0;
						if(TA_states[0 + (k*2) +(clause*features*2)] == 0){
							
							document.getElementById(str_TA_new).style.backgroundImage ="url(images/bottom-f.gif)" ;
						}
						else{
							document.getElementById(str_TA_new).style.backgroundImage ="url(images/m-b-f.gif)" ;
						}	
					}
					else{
						new_state = 1;
						if(TA_states[0 + (k*2) +(clause*features*2)] == 5){
							document.getElementById(str_TA_new).style.backgroundImage ="url(images/top-f.gif)" ;
						}
						else{
							document.getElementById(str_TA_new).style.backgroundImage ="url(images/m-p-f.gif)" ;
						}

					}
					if(prev_state == 0 && new_state == 1){
						document.getElementById(str_fb).innerHTML = "P";
					}
					else if(prev_state == 1 && new_state == 0){
						document.getElementById(str_fb).innerHTML = "P";
					}
					else if(prev_state == 1 && new_state == 1 || (prev_state == 0 && new_state == 0)){
						document.getElementById(str_fb).innerHTML = "R";
					}	
				}
				rand = getRand();
				if(TA_states[1 + (k*2) +(clause*features*2)] > 0 && (rand <= 1.0/s)){
					var prev_state_2;
					var new_state_2;
					var str_TA = "c";
					var str_fb = "fb_c";
					// remove the dot from the old TA 
					str_TA = str_TA.concat((clause).toString());
					str_fb = str_fb.concat((clause).toString());
					str_TA = str_TA.concat("_X");
					str_TA = str_TA.concat((k).toString());
					str_TA = str_TA.concat("_bar_TA_");
					str_fb = str_fb.concat("_x");
					str_fb = str_fb.concat((k).toString());
					str_TA_prev = str_TA.concat((TA_states[1 + (k*2) +(clause*features*2)]).toString());
					console.log(str_TA_prev);
					if(TA_states[1 + (k*2) + (clause*features*2)] <=2){
						prev_state_2 = 0;
						if(TA_states[1 + (k*2) +(clause*features*2)] == 0){
							document.getElementById(str_TA_prev).style.backgroundImage ="url(images/bottom.gif)" ;
						}
						else{
							document.getElementById(str_TA_prev).style.backgroundImage ="url(images/m-b.gif)" ;
						}	
					}
					else{
						prev_state_2 = 1;
						if(TA_states[1 + (k*2) +(clause*features*2)] == 5){
							document.getElementById(str_TA_prev).style.backgroundImage ="url(images/top.gif)" ;
						}
						else{
							document.getElementById(str_TA_prev).style.backgroundImage ="url(images/m-p.gif)" ;
						}

					}
					// Transition the TA
					TA_states[1 + (k*2) +(clause*features*2)] = TA_states[1 + (k*2) +(clause*features*2)] - 1;
					str_TA_new = str_TA.concat((TA_states[1 + (k*2) +(clause*features*2)]).toString());
					console.log(str_TA_new);
					if(TA_states[1 + (k*2) + (clause*features*2)] <=2){
						new_state_2 = 0;
						if(TA_states[1 + (k*2) +(clause*features*2)] == 0){
							document.getElementById(str_TA_new).style.backgroundImage ="url(images/bottom-f.gif)" ;
						}
						else{
							document.getElementById(str_TA_new).style.backgroundImage ="url(images/m-b-f.gif)" ;
						}	
					}
					else{
						new_state_2 = 1;
						if(TA_states[1 + (k*2) +(clause*features*2)] == 5){
							document.getElementById(str_TA_new).style.backgroundImage ="url(images/top-f.gif)" ;
						}
						else{
							document.getElementById(str_TA_new).style.backgroundImage ="url(images/m-p-f.gif)" ;
						}

					}
					str_fb = str_fb.concat("b");
					if(prev_state_2 == 0 && new_state_2 == 1){
						document.getElementById(str_fb).innerHTML = "P";
					}
					else if(prev_state_2 == 1 && new_state_2 == 0){
						document.getElementById(str_fb).innerHTML = "P";
					}
					else if(prev_state_2 == 1 && new_state_2 == 1 || (prev_state_2 == 0 && new_state_2 == 0)){
						document.getElementById(str_fb).innerHTML = "R";
					}									
				}
			}
			else if (X[example_index][k] == 0){
				var rand = getRand();
				if(TA_states[1 + (k*2) +(clause*features*2)] < 5 && (BOOST_TRUE_POSITIVE_FEEDBACK == 1 || (rand <= (s-1)/s))){
					var prev_state_2;
					var new_state_2;
					var str_TA = "c";
					var str_fb = "fb_c";
					// remove the dot from the old TA 
					str_TA = str_TA.concat((clause).toString());
					str_fb = str_fb.concat((clause).toString());
					str_TA = str_TA.concat("_X");
					str_TA = str_TA.concat((k).toString());
					str_TA = str_TA.concat("_bar_TA_");
					str_fb = str_fb.concat("_x");
					str_fb = str_fb.concat((k).toString());
					str_TA_prev = str_TA.concat((TA_states[1 + (k*2) +(clause*features*2)]).toString());
					console.log(str_TA_prev);
					if(TA_states[1 + (k*2) + (clause*features*2)] <=2){
						prev_state_2 = 0;
						if(TA_states[1 + (k*2) +(clause*features*2)] == 0){
							document.getElementById(str_TA_prev).style.backgroundImage ="url(images/bottom.gif)" ;
						}
						else{
							document.getElementById(str_TA_prev).style.backgroundImage ="url(images/m-b.gif)" ;
						}	
					}
					else{
						prev_state_2 = 1;
						if(TA_states[1 + (k*2) +(clause*features*2)] == 5){
							document.getElementById(str_TA_prev).style.backgroundImage ="url(images/top.gif)" ;
						}
						else{
							document.getElementById(str_TA_prev).style.backgroundImage ="url(images/m-p.gif)" ;
						}

					}
					// Transition the TA
					TA_states[1 + (k*2) +(clause*features*2)] = TA_states[1 + (k*2) +(clause*features*2)] + 1;
					str_TA_new = str_TA.concat((TA_states[1 + (k*2) +(clause*features*2)]).toString());
					console.log(str_TA_new);
					if(TA_states[1 + (k*2) + (clause*features*2)] <=2){
						new_state_2 = 0;
						if(TA_states[1 + (k*2) +(clause*features*2)] == 0){
							document.getElementById(str_TA_new).style.backgroundImage ="url(images/bottom-f.gif)" ;
						}
						else{
							document.getElementById(str_TA_new).style.backgroundImage ="url(images/m-b-f.gif)" ;
						}	
					}
					else{
						new_state_2 = 1;
						if(TA_states[1 + (k*2) +(clause*features*2)] == 5){
							document.getElementById(str_TA_new).style.backgroundImage ="url(images/top-f.gif)" ;
						}
						else{
							document.getElementById(str_TA_new).style.backgroundImage ="url(images/m-p-f.gif)" ;
						}

					}
					str_fb = str_fb.concat("b");
					if(prev_state_2 == 0 && new_state_2 == 1){
						document.getElementById(str_fb).innerHTML = "P";
					}
					else if(prev_state_2 == 1 && new_state_2 == 0){
						document.getElementById(str_fb).innerHTML = "P";
					}
					else if(prev_state_2 == 1 && new_state_2 == 1 || (prev_state_2 == 0 && new_state_2 == 0)){
						document.getElementById(str_fb).innerHTML = "R";
					}											
				}
				rand = getRand();
				if(TA_states[0 + (k*2) +(clause*features*2)] > 0 && (rand <= 1.0/s)){
					var prev_state;
					var new_state;
					str_TA = "c";
					str_fb = "fb_c";
					// remove the dot from the old TA 
					str_TA = str_TA.concat((clause).toString());
					str_fb = str_fb.concat((clause).toString());
					str_TA = str_TA.concat("_X");
					str_TA = str_TA.concat((k).toString());
					str_TA = str_TA.concat("_TA_");
					str_fb = str_fb.concat("_x");
					str_fb = str_fb.concat((k).toString());
					str_TA_prev = str_TA.concat((TA_states[0 + (k*2) +(clause*features*2)]).toString());
					console.log(str_TA_prev);
					if(TA_states[0 + (k*2) + (clause*features*2)] <=2){
						prev_state = 0;
						if(TA_states[0 + (k*2) +(clause*features*2)] == 0){
							document.getElementById(str_TA_prev).style.backgroundImage ="url(images/bottom.gif)" ;
						}
						else{
							document.getElementById(str_TA_prev).style.backgroundImage ="url(images/m-b.gif)" ;
						}	
					}
					else{
						prev_state = 1;
						if(TA_states[0 + (k*2) +(clause*features*2)] == 5){
							document.getElementById(str_TA_prev).style.backgroundImage ="url(images/top.gif)" ;
						}
						else{
							document.getElementById(str_TA_prev).style.backgroundImage ="url(images/m-p.gif)" ;
						}

					}
					// Transition the TA
					TA_states[0 + (k*2) +(clause*features*2)] =TA_states[0 + (k*2) +(clause*features*2)] - 1;
					str_TA_new = str_TA.concat((TA_states[0 + (k*2) +(clause*features*2)]).toString());
					console.log(str_TA_new);
					if(TA_states[0 + (k*2) + (clause*features*2)] <=2){
						new_state = 0;
						if(TA_states[0 + (k*2) +(clause*features*2)] == 0){
							
							document.getElementById(str_TA_new).style.backgroundImage ="url(images/bottom-f.gif)" ;
						}
						else{
							document.getElementById(str_TA_new).style.backgroundImage ="url(images/m-b-f.gif)" ;
						}	
					}
					else{
						new_state = 1;
						if(TA_states[0 + (k*2) +(clause*features*2)] == 5){
							document.getElementById(str_TA_new).style.backgroundImage ="url(images/top-f.gif)" ;
						}
						else{
							document.getElementById(str_TA_new).style.backgroundImage ="url(images/m-p-f.gif)" ;
						}

					}
					if(prev_state == 0 && new_state == 1){
						document.getElementById(str_fb).innerHTML = "P";
					}
					else if(prev_state == 1 && new_state == 0){
						document.getElementById(str_fb).innerHTML = "P";
					}
					else if(prev_state == 1 && new_state == 1 || (prev_state == 0 && new_state == 0)){
						document.getElementById(str_fb).innerHTML = "R";
					}		
				}	
			}
		}
	}
}

async function mc_tm_update(example_index, y, class_1, class_2, X){
	document.getElementById("info").innerHTML = "Feedback to Automata";
	// ======================================
	// FEEDBACK FOR CLAUSES
	// ======================================
	// for(let j = 0; j < number_of_clauses; j++){
	// 	fb4_clauses[j] = 0;
	// }

	// for(let j = 0; j < number_of_clauses; j++){
	// 	// CLASS 0
	// 	if(j < 2){
	// 		var rand = getRand();
	// 		if(rand > (1.0/T*2)*(T - class_1.a)){
	// 			continue;
	// 		}
	// 	 	if(TM_clauses_polarity[j] >=0){
	// 	 		fb4_clauses[j] = 1;
	// 	 	} 
	// 	 	else{
	// 	 		fb4_clauses[j] = -1;
	// 	 	}
	// 	}
	// 	else if (j >= 2){
	// 		var rand = getRand();
	// 		if(rand > (1.0/T*2)*(T + class_2.a)){
	// 			continue;
	// 		}
	// 		if(TM_clauses_polarity[j] >=0){
	// 	 		fb4_clauses[j] = -1;
	// 	 	} 
	// 	 	else{
	// 	 		fb4_clauses[j] = 1;
	// 	 	}
	// 	}
	// }
	// if y = 1
	console.log(y[example_index]);
	var target;
	if(y[example_index] == 1){	
		for(let c = 0; c <number_of_clauses; c ++){
			if(c < number_of_clauses/classes){
				// CLASS 0
				target = 0;
				var rand = getRand();
				fb4_clauses[c] =  (2*target-1)*(1 - 2 * (c & 1))*(rand <= (1.0/(T*2))*(T + (1 - 2*target)*class_1.a));
				console.log(fb4_clauses[c]);
			}
			else{
				// CLASS 1
				target = 1;
				var rand = getRand();
				fb4_clauses[c] =  (2*target-1)*(1 - 2 * (c & 1))*(rand <= (1.0/(T*2))*(T + (1 - 2*target)*class_2.a));
				console.log(fb4_clauses[c]);
			}
		}
	} 
	// if y = 0
	if(y[example_index] == 0){	
		for(let c = 0; c <number_of_clauses; c ++){
			if(c < number_of_clauses/classes){
				// CLASS 0
				target = 1;
				var rand = getRand();
				fb4_clauses[c] =  (2*target-1)*(1 - 2 * (c & 1))*(rand <= (1.0/(T*2))*(T + (1 - 2*target)*class_1.a));
				console.log(fb4_clauses[c]);
			}
			else{
				// CLASS 1
				target = 0;
				var rand = getRand();
				fb4_clauses[c] =  (2*target-1)*(1 - 2 * (c & 1))*(rand <= (1.0/(T*2))*(T + (1 - 2*target)*class_2.a));
				console.log(fb4_clauses[c]);
			}
		}
	} 	
	// ======================================
	// FEEDBACK FOR AUTOMATAS
	// ======================================
	for(let c = 0; c< number_of_clauses; c++){
		if(fb4_clauses[c] > 0){
			type_i_feedback(example_index, X, c);
		}
		else if(fb4_clauses[c] < 0){
			type_ii_feedback(example_index, X, c);
		}
	}
}

async function sum_class_votes(class_1, class_2){
	// var class_sum = 0;
	for(let c = 0; c < number_of_clauses; c++){
		if(c < (number_of_clauses/classes)){
			class_1.a = class_1.a + TM_clauses_polarity[c];	
		}
		else{
			class_2.a = class_2.a + TM_clauses_polarity[c];	
		}		
	}
	document.getElementById("class_sum1").innerHTML = (class_1.a).toString(); 
	document.getElementById("class_sum2").innerHTML = (class_2.a).toString();
	console.log(class_1);
	console.log(class_2);
}

async function clause_polarity(X, X_hat, y, clause_number){
	var sign = 1 - 2 * (clause_number & 1);
	var str_c_out = "clause_output";
	TM_clauses_polarity[clause_number] = sign * TM_clauses[clause_number];
	// console.log(TM_clauses[clause_number].toString());
	str_c_out = str_c_out.concat((clause_number+1).toString());
	document.getElementById(str_c_out).style.backgroundColor = "rgba(250,218,94)";
	document.getElementById(str_c_out).innerHTML = (TM_clauses_polarity[clause_number]).toString(); 
}

async function clause_output(X, X_hat, y, clause_number, datapoint){
	var action_include;
	var action_include_negated;
	var exclude_all; 
	var str_c_out = "clause_output";
	TM_clauses[clause_number] = 1;
	for(let i = 0; i < features; i++){
		action_include = action(TA_states[0 + (i*2) + (clause_number*features*2)]);

		// console.log(TA_states[0 + (i*2) + (clause_number*features*2)].toString());

		action_include_negated = action(TA_states[1 + (i*2) + (clause_number*features*2)]);
		exclude_all = exclude_all && !(action_include ==1 || action_include_negated == 1);
		if((action_include == 1 && X[datapoint][i] ==0) || (action_include_negated == 1 && X[datapoint][i] == 1)){
			TM_clauses[clause_number] = 0;
			break;
		}
	}
	TM_clauses[clause_number] = TM_clauses[clause_number] && !(predict == PREDICT && exclude_all == 1);
	str_c_out = str_c_out.concat((clause_number+1).toString());
	// TM_clauses[clause_number] = TM_clauses[clause_number] ? 0: 1;
	document.getElementById(str_c_out).style.backgroundColor = "rgba(250,218,94)";
	if(TM_clauses[clause_number] == 0){
		document.getElementById(str_c_out).innerHTML = (0).toString(); 
	}
	else if(TM_clauses[clause_number] == 1){
		document.getElementById(str_c_out).innerHTML = (1).toString();
	}

	
}

async function testing(X, X_hat, y){
	var cumulative_acc = 0;
	for(let e = 0; e< epochs; e++){
		var acc = 0;
		var errors = 0;
				var e_String = "EPOCH: "
		e_String = e_String.concat((e).toString());
		document.getElementById("epochs").innerHTML = e_String;
	for (let i = 0; i < examples; i++){
		var dummy_str = e_String;
		var str = " Datapoint: "
		str = str.concat((i).toString());
		dummy_str = dummy_str.concat(str);
		document.getElementById("epochs").innerHTML = dummy_str;
		if(e > 1){
			speed = 500;
		}
		if(e > 6){
			speed = 250;
		}
		var guess = 0;
		// update the features and literals
		await sleep(speed);
		document.getElementById("info").innerHTML = "Load Input";
		if( ( X[i][0] && !X[i][1] ) || ( !X[i][0] && X[i][1] ) ) {
		  document.getElementById("exp_class").innerHTML = "EXPECTED: 1";
		}
		else{
			document.getElementById("exp_class").innerHTML = "EXPECTED: 0";	
		}
		
		// change the colours 
		document.getElementById("X0").innerHTML = (X[i][0]).toString();
		document.getElementById("X1").innerHTML = (X[i][1]).toString();
		document.getElementById("X0").style.backgroundColor = "rgba(250,218,94)";
		document.getElementById("X1").style.backgroundColor = "rgba(250,218,94)";
		await sleep(speed);
		document.getElementById("X0").style.backgroundColor = "rgba(255, 255, 255, 255)";
		document.getElementById("X1").style.backgroundColor = "rgba(255, 255, 255, 255)";
			
		await sleep(speed);
		document.getElementById("info").innerHTML = "Generate Literals";
		//change the colours
		document.getElementById("X0_lit").style.backgroundColor = "rgba(250,218,94)";
		document.getElementById("X1_lit").style.backgroundColor = "rgba(250,218,94)";
		document.getElementById("X0_bar_lit").style.backgroundColor = "rgba(250,218,94)";
		document.getElementById("X1_bar_lit").style.backgroundColor = "rgba(250,218,94)";
		document.getElementById("X0_lit").innerHTML = (X[i][0]).toString();
		document.getElementById("X1_lit").innerHTML = (X[i][1]).toString();
		document.getElementById("X1_bar_lit").innerHTML = (X_hat[i][1]).toString();
		document.getElementById("X0_bar_lit").innerHTML = (X_hat[i][0]).toString();

		await sleep(speed);
		document.getElementById("X0_lit").style.backgroundColor = "rgba(255, 255, 255, 255)";;
		document.getElementById("X1_lit").style.backgroundColor = "rgba(255, 255, 255, 255)";
		document.getElementById("X0_bar_lit").style.backgroundColor = "rgba(255, 255, 255, 255)";
		document.getElementById("X1_bar_lit").style.backgroundColor = "rgba(255, 255, 255, 255)";

		document.getElementById("info").innerHTML = "Calculate Clause Ouputs";
		await sleep(speed);
		// calculate the clause output 
		for(let c = 0; c < number_of_clauses; c++){
			clause_string = "clausebox";
			clause_string = clause_string.concat((c+1).toString());
			console.log(clause_string);
			document.getElementById(clause_string).style.backgroundColor = "rgba(250,218,94)";
			clause_output(X, X_hat, y, c, i);
			await sleep(speed);
			var str_c_out = "clause_output";
			str_c_out = str_c_out.concat((c+1).toString());
			document.getElementById(clause_string).style.backgroundColor = "rgba(255, 255, 255, 255)";
			document.getElementById(str_c_out).style.backgroundColor = "rgba(255, 255, 255, 255)";
		}
		for(let c = 0; c < number_of_clauses; c++){
			document.getElementById("info").innerHTML = "Add the polarity to the clauses";
			// clause_string = "clausebox";
			// clause_string = clause_string.concat((c+1).toString());
			// console.log(clause_string);
			// document.getElementById(clause_string).style.backgroundColor = "rgba(250,218,94)";
			clause_polarity(X, X_hat, y, c);
			// console.log(clause_polarity[])
			await sleep(speed);
			var str_c_out = "clause_output";
			str_c_out = str_c_out.concat((c+1).toString());
			document.getElementById(clause_string).style.backgroundColor = "rgba(255, 255, 255, 255)";
			document.getElementById(str_c_out).style.backgroundColor = "rgba(255, 255, 255, 255)";
		}
		var class_1 = {a: 0};
		var class_2 = {a: 0};
		sum_class_votes(class_1, class_2);
		await sleep(speed);
		console.log((class_1));
		console.log((class_2));
		if(class_1.a >= class_2.a){
			guess = 0;
			document.getElementById("info").style.backgroundColor = "rgba(250,218,94)";
			document.getElementById("info").innerHTML = "Classification: 0";
			document.getElementById("g_class").style.backgroundColor = "rgba(250,218,94)";
			document.getElementById("g_class").innerHTML = "GUESSED: 0";
			await sleep(speed);
		} 
		else{
			guess = 1;
			document.getElementById("info").style.backgroundColor = "rgba(250,218,94)";
			document.getElementById("info").innerHTML = "Classification: 1";
			document.getElementById("g_class").style.backgroundColor = "rgba(250,218,94)";
			document.getElementById("g_class").innerHTML = "GUESSED: 1";
			await sleep(speed);
		}

		if(guess != y[i]){
			errors = errors + 1;
		}
		// reset the class_sums
		document.getElementById("class_sum1").innerHTML = (0).toString(); 
		document.getElementById("class_sum2").innerHTML = (0).toString();
		document.getElementById("exp_class").innerHTML = "EXPECTED: ";
		document.getElementById("g_class").innerHTML = "GUESSED: ";
		document.getElementById("g_class").style.backgroundColor = "rgba(240,240,250)";
		await sleep(speed);

		// feedback
		mc_tm_update(i, y, class_1, class_2, X);
		await sleep(speed);
		// reset the r/p/-
		for(let m = 0; m < number_of_clauses; m++){
			for(let n = 0; n < features; n++){
				var str_fb = "fb_c";
				str_fb = str_fb.concat((m).toString()); 
				str_fb = str_fb.concat("_x"); 
				str_fb = str_fb.concat((n).toString()); 
				document.getElementById(str_fb).innerHTML = "-";
				str_fb = str_fb.concat("b");
				document.getElementById(str_fb).innerHTML = "-";
			}
		}

	}
	acc = 1.0 - 1.0 * errors/examples;
	var acc_String = "Acc: ";
	acc_String = acc_String.concat(acc.toString());
	document.getElementById("acc").innerHTML = acc_String;
		for(let q = 0; q < 16; q++){
			console.log(TA_states[q]);
		}
	cumulative_acc = cumulative_acc + acc;
	var avg_acc = cumulative_acc / (e+1);
	var avg_acc = avg_acc.toFixed(2);

	var acc_String = "Avg Acc: ";
	acc_String = acc_String.concat(avg_acc.toString());
	document.getElementById("average_acc").innerHTML = acc_String;
	}

}

function Start_TM(){
	document.getElementById("button").disabled = true;
	//  written exclusively for xor
	// str_TA = "c0_X0_TA_5";
	// var img = document.createElement('img');
	// img.src = 'images/m-p-f.gif';
	// document.getElementsByClass(str_TA).appendChild(img); 
	// 				// $(str_TA).css("backgroundImage", "url('images/m-b-f.gif')")
	
	// initialize the TAs:
	document.getElementById("info").innerHTML = "Initialize TAs";
	for (let i = 0; i < (number_of_clauses); i++){
		for(let j = 0; j < (features); j++){
			for(let k = 0; k < (2); k++){
				// get the document ID
				var str_TA = 'c';
				str_TA = str_TA.concat(i.toString());
				str_TA = str_TA.concat("_X");
				str_TA = str_TA.concat(j.toString());
				str_TA = str_TA.concat("_");

				if(k !=0){
					str_TA = str_TA.concat("bar_");
				}
				str_TA = str_TA.concat("TA_");
				var img;
				if(Math.random() < 0.5){
					TA_states[k + (j*2) +(i*features*2)] = number_of_states;
					// replace image to match this one
					str_TA = str_TA.concat(number_of_states.toString());
					// console.log(str_TA);
					// img = "url(images/m-b-f.gif)"
					document.getElementById(str_TA).style.backgroundImage ="url(images/m-b-f.gif)" ; 
					// $(str_TA).css("backgroundImage", "url('images/m-b-f.gif')");
				} 
				else{
					TA_states[k + (j*2) +(i*features*2)] = number_of_states + 1;
					str_TA = str_TA.concat((number_of_states +1 ).toString());
					// console.log(str_TA);
					// img.src = 'images/m-p-f.gif';
					document.getElementById(str_TA).style.backgroundImage ="url(images/m-p-f.gif)" ;  
				}
			}
		}
	}
	// for(let e = 0; e< epochs; e++){
		testing(X, X_hat, y);
	// }
	// print the literals to the literal boxes	
}