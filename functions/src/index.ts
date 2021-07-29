import * as functions from "firebase-functions";
import {conversation,Simple,Collection, ConversationV3} from '@assistant/conversation'

import * as admin from "firebase-admin"
import { Task } from './interface'
const RETURN_CODE_ERROR = "-1";

admin.initializeApp()

const auth = admin.auth();
const db = admin.firestore();

const webhookHandler = conversation({debug:true,clientId:'331665416413-pbmm12b635s2nusvvkj2l6ma3t362lqb.apps.googleusercontent.com'});
webhookHandler.handle("begin_action",async (conv : ConversationV3) => {

	//Get the user's query
	const query = conv.intent.query
	
	if (query === undefined){
		 conv.add(new Simple({text:"I didn't understand what task you're starting!",speech:"I didn't quite get that, say again?"}));
		 return;
	}

	const userEmail = conv.user.params.tokenPayload.email;  
	const userDoc : FirebaseFirestore.DocumentSnapshot = await db.collection("users")
							.doc(userEmail)
							.get()	
	if (!userDoc){
		conv.add(new Simple({
								text:`Can't find user document for ${userEmail}`,
								speech:`Cannot find data for the given user`
						})
		)
		return;
	}

	const taskMap :any = await userDoc.get("TaskMapping");

	if (taskMap === undefined || taskMap === null){
		conv.add(new Simple({
					speech:`<p>Cannot load the user's task map</p>`,
					text:`User TaskMap is invalid:${taskMap}`}
					)
			)
		return;
	}
	
	//Look in the taskmap for the reference
	let taskDocument: FirebaseFirestore.DocumentReference | undefined = taskMap[query.trim().toLowerCase()]

	if (!taskDocument){
		conv.add(new Simple({
						speech:"<p>Cannot find task with that name</p>",
						text:`Cannot find task with name ${query}`
					})
				)
		return;	
	}

	const snapshot : FirebaseFirestore.DocumentSnapshot = await taskDocument.get()

	if (!snapshot.exists){
		conv.add(new Simple({speech:`Snapshot doesn't exist ${snapshot}`,text:"Snapshot doesn't exist"}))
		return;
	}

	const userStartedTask : Task = snapshot.data() as Task;
	
	conv.user.params.taskId = userStartedTask.id;
	conv.user.params.seen = "";
	conv.user.params.stepNum = 0;
	conv.user.params.totalSteps = userStartedTask.TaskChecklist.length;
	conv.add(new Simple({speech:`<speak><p>You set ${conv.user.params.totalSteps} reminders for this task</p><p>They were:</p></speak>`}))
})

webhookHandler.handle("read_checklist_item",async (convo : ConversationV3)=>{
	const taskId : string = convo.user.params.taskId
	const userEmail = convo.user.params.tokenPayload.email

	try{
    	const task = db.collection("users")
			.doc(userEmail)
			.collection("Tasks")
			.doc(taskId)
		
		if (!task){
			functions.logger.error(`Cannot find task with id:${taskId}`);
			return RETURN_CODE_ERROR;
		}

		const t = await task.get()

		const taskStepArray : [] = t.get('TaskChecklist');
		let stepIndex : number = convo.user.params.stepNum;
		const taskStep = taskStepArray[stepIndex];

		convo.add(new Simple({text:`${taskStep}`,speech:`<speak><p>${taskStep}</p></speak>`}))
		stepIndex+=1;
		convo.user.params.stepNum = stepIndex;

  	}
	catch (error) {
		functions.logger.debug(`${error}`);
		return;
  	}
	return;
})

webhookHandler.handle('create_user',async(conv)=>{
	const tokenPayload = conv.user.params["tokenPayload"];  
	
	if (tokenPayload != null && tokenPayload != undefined){
		const emailValue = tokenPayload["email"];
		try{
		conv.user.params.uid = await auth.getUserByEmail(emailValue)
		} catch(ex) {
			if (!(ex instanceof Error)){
				throw ex;
			}
			conv.user.params.uid = await auth.createUser({
				email:emailValue
			}).then(()=>
			{
				conv.add(new Simple({text:'Account linking successful!',speech:'Account linked successfully!'}))
			})
		}		
	}
})

exports.fullfillment = functions.https.onRequest(webhookHandler)

