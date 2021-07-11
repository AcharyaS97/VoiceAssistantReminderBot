import * as functions from "firebase-functions";
import {conversation,Simple} from '@assistant/conversation'

const webhookHandler = conversation();
webhookHandler.handle("GetChecklist",conv =>
	{
		const query = conv.intent.query

		let output : Simple = new Simple({});

		if (query === "dishes"){
			output = new Simple({
				speech: "<speak><p>Clean the sink</p><p>Start the cycle</p></speak>",
				text:"Clean the sink, start the cycle"
			});
		}
		else if (query === "lawn"){
			output = new Simple({
				speech: "<speak><p>Sweep the sidewalk</p><p>Clean the machine after you finish</p></speak>",
				text:"Sweep the sidewalk,Clean the machine after you finish"
			});
		}

		conv.add(output);

})

exports.fullfillment = functions.https.onRequest(webhookHandler)

