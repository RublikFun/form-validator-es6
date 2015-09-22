# Storyboarder
	Storyboarder is an easy-to-use form wizard/validation library. You establish the scenes, navigation buttons, and inputs in the dom and it will handle the rest. Storyboarder works well in all browsers down to (and including) IE8. 

	Some things Storyboarder is good for:
		- establishing a linear flow of dom elements ( scenes )
		- requiring inputs to be filled, making inputs optional
		- reporting unfilled/errored inputs to the user
		- adding callbacks to the completion of the wizard
		- adding callbacks to the completion of a scene
		- adding additional scenes to the flow
		- adding additional inputs to the scenes
		- linking inputs' required states
		- reporting all input activity in a json-like fashion

##Basic Usage:
    <div class="test-storyboarder">
	    <div class="js-scene">
		    <input class="js-answer" data-field="test1" type="text">
		    <div class="js-button"></div>
	    </div>
	    <div class="js-scene">
		    <input class="js-answer" data-field="test2" type="text">
		    <div class="js-button"></div>
	    </div>
		</div>
		<script>
			var storyboarder = new Storyboarder()
					storyboarder.report() //produces a json-like object
					//{ "test1": "", "test2": ""} 
		</script>
</div>