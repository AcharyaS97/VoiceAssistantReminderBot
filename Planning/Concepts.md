How the Google Conversational Actions SDK works

Conversational Actions define entry points into a conversation called invocations

An invocation defines how users tell Assistant they want to start a conversation with one of your actions. An Actions invocation is defined by a single intent that gets matched when users request the action

Conversation

- How users interact with an Action after invoked
- Consists of intents, types, scenes, prompts

Actions delegate work to fullfilment -> web services that communicate with your actions via webhooks.

Multiple actions are bundled together in an Actions project

# Invocation

- Associated with a display name associated with the brand of the app
- Can use the display name on its own, or in combination with deep link phrases

"Ok Google, talk to Facts about Google" -> Main Intent (actions.intent.MAIN)

The assistant matches the user's request with the corresponding intent that matches the request, actions.intent.Main in the previous case

#Conversation

How a typical conversation goes

User says something, it is matched to an appropriate intent.

Intent is matched if the language model for it can be closely or exactly matched to the user input. The language model for the intent is specified using training phrases, which the Assistant uses to make the language model.

When the assistant NLU matches an intent, it can extract parameters that you need from the input. parameters have types, like a date or number. you can annotate specific parts of an intent's training phrases to specify which parameters to extract

A scene processes the matched intent.

Scenes are the logic executors of an action, carrying out logic necessary to drive a conversation forward. scenes run in a loop, providing a flexible execution lifecycle

When a scene is doing executing, it typically sends back prompts

Intents

# System Intents

Assistant matches system intents based on standard system events

- Users saying "pause" to pause the media player,

Because these intents are provided by Assistant, you don't have to worry about how they're matched, but only how to handle the intents when they are matched.

System intents replace the need to create user intents for actions that are frequently required, such as YES and NO. System intents are trained for all locales, enabling you to more easily implement a consistent experience for your users across multiple languages. System intents can also be set as global intents.

List of intents


| Intent                                                                                            | Description                                                                                                                                                                          |
| --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| actions.intent.MAIN                                                                               | Every Actions project must contain this default main invocation, which is tied to your display name. Users say phrases like "Ok Google, talk to<display name>" to invoke the Action. |
| <br />actions.intent.NO_MATCH_1<br />actions.intent.NO_MATCH_2<br />actions.intent.NO_MATCH_FINAL | These intents are matched when the user says something that can't be matched to an intent in your Action. You can set individual reprompts and an exit message in the final intent.  |
| actions.intent.NO_INPUT_1<br />actions.intent.NO_INPUT_2<br />actions.intent.NO_INPUT_Final       |                                                                                                                                                                                      |
|                                                                                                   |                                                                                                                                                                                      |


| actions.intent.<wbr/>CANCEL                                   | This intent is matched when the user wants to exit your Actions during a conversation, such as a user saying,*"I want to quit."*                                                         |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| actions.intent.<wbr/>MEDIA_<wbr/>STATUS_<wbr/>FINISHED        | This intent is matched and sent to your Action when a user completes media playback or skips to the next piece of media.                                                                 |
| actions.<wbr/>intent.<wbr/>MEDIA_<wbr/>STATUS_<wbr/>PAUSED    | This intent is matched and sent to your Action when a user pauses media playback in a media response.                                                                                    |
| `actions.<wbr/>intent.<wbr/>MEDIA_<wbr/>STATUS_<wbr/>STOPPED` | This intent is matched and sent to your Action when a user stops or exits media playback from a media response.                                                                          |
| `actions.<wbr/>intent.<wbr/>MEDIA_<wbr/>STATUS_<wbr/>FAILED`  | This intent is matched and sent to your Action when a media response's player fails to play.                                                                                             |
| `actions.<wbr/>intent.<wbr/>YES`                              | This intent is matched when a user provides an affirmative response to your Action.This system intent is supported only in English.                                                      |
| `actions.<wbr/>intent.<wbr/>NO`                               | This intent is matched when a user provides a negative response to your Action.This system intent is supported only in English.                                                          |
| `actions.<wbr/>intent.<wbr/>REPEAT`                           | This intent is matched when a user asks the Action to repeat.This system intent is supported only in English.                                                                            |
| `actions.<wbr/>intent.<wbr/>PLAY_<wbr/>GAME`                  | This intent is matched when a user asks to play a game. This intent lets you opt into an implicit invocation (invocation without using your display name) provided by Actions on Google. |

# User Intents

When you build Actions, you create user intents that contain training phrases, which extends Assistant's ability to understand even more. Assistant uses your training phrases to augment its NLU when it delegates user requests to your Actions.

- A Global intent designation
  Designates if the Assistant runtime can match the user intent at invocation time as well as during a conversation. By default, Assistant can match user intents only during a conversation. Only intents that you mark as global are eligible for deep link invocation.
- Training phrases
  Examples of what a user might say to match the intent.
- Parameters
  Typed data that you want to extract from user input.

  To create a parameter, annotate training phrases with types to notify the NLU engine that you want portions of user input to be extracted.

  You can use system types or create your own custom types for parameters.

  When the NLU engine detects a parameter match in user input, it extracts the value as a typed parameter, so you can carry out logic with it in a scene.
  If an intent parameter has the same name as a scene slot, the runtime automatically fills the scene slot with the value from the intent parameter.

# Scenes

Scenes represent individual states of your conversation and their main purpose is to organize your conversation into logical chunks, execute tasks, and return prompts to users.

* **Looped execution** - Scenes execute within a loop until it meets transition criteria that you define. This lets you create control logic flows much more efficiently within a single scene.
* **Dialog separation** - In combination with intents, scenes let you group dialogs into logical chunks, giving you easy ways to build user request and Action response pairs.
* **Intent match scoping** - Because only one scene can be active at a time, you can scope intent matching to scenes of your choice and have them match only when those scenes are active.
* **Slot filling** - You can use slot filling within a scene to collect multiple pieces of typed user input, without having to create multiple intents
* **In-scene conditions** - You can check slots, session, user, and home storage to carry out simple, conditional logic without triggering a webhook.

When a scene first becomes active, you can carry out one time tasks in the **On enter** stage. The On enter stage executes only once, and is the only stage that doesn't run inside a scene's execution loop.

1. Open `<scene_name>.yaml` and use the 'onEnter' field to add a message that is sent to the user when the scene is loaded. The content of the file should look like this:

```
onEnter:
  staticPrompt:
    candidates:
    - promptResponse:
        firstSimple:
          variants:
          - speech: This message is sent to the user when the scene loads
```

2. To transition to the newly created scene when your Action is invoked, add a transition to the scene to `sdk/custom/global/actions.intent.MAIN.yaml`:

   ```yaml
   transitionToScene: scene_name
   ...
   ```

   Check Conditions

   Conditions let you check slot filling, session storage, user storage, and home storage parameters to control scene execution flow.

   As an example, you can use conditions to check that a slot is filled before triggering a webhook event and/or sending prompts to the user.

   1. Open `sdk/custom/scenes/<scene_name>.yaml`, replacing `<scene_name>` with the name of the scene you want to add the slot filling check to
   2. Use the `conditionalEvents` field to add a conditional event that sends a prompt to the user after the slot is filled (`scene.slots.status = "FINAL"`). The content of the file should look like:
   3. Open `sdk/custom/scenes/<scene_name>.yaml`, replacing `<scene_name>` with the name of the scene you want to add the slot filling check to.
   4. Use the `conditionalEvents` field to add a conditional event that sends a prompt to the user after the slot is filled (`scene.slots.status = "FINAL"`). The content of the file should look like:

## **Custom scenes**

A custom scene is a building block of conversational logic that forms a part of your Action's conversation model. 
*Activation* 
	-Scenes have stages that define how and when it starts, called the , the conversational processing it performs, called the  , and how the scene ends, called the *Transition* :

*Execution lifecycle*
* [**Activation**](https://developers.google.com/assistant/conversational/scenes#activation)	

	Before a scene can execute, it needs to be active. Only one scene can be active at any time. You can activate scenes in the following ways:

    * **Invocation** 
      - When user input matches a global intent's language model, you can activate a scene to process the invocation.
  
    * **Static scene transition** 
      - When a scene meets transition criteria, you can transition to another scene.
    * **Dynamic scene transition** 
      - Within a webhook handler, you can programmatically transition to another scene

* [**Execution**](https://developers.google.com/assistant/conversational/scenes#execution)
  
  When a scene is active, it executes in a well-defined lifecycle:

    1. On enter - This stage runs only once when a scene is activated. You can trigger a webhook or prompt the user to do one-time setup of your scene.

	The only stage that doesn't execute in a scene's execution loop. It does one-time initialization of your scene in the following order:

        - If the Assistant runtime can fill any slots from a previously matched intent, it does so now to prepare the scene for the slot filling stage. For example, some user input might match an intent and provide a slot. That intent match activates a scene and can fill a slot in a scene if the slot names match.
  
       - If a webhook is enabled, it triggers an event synchronously and waits for your web service to return a response.

       - When the runtime receives a webhook response, it resolves any parameter references in prompts and selects a prompt candidate based on the user surface and then selects one variant for the candidate to send to the user later.

       - If the webhook response contains a prompt, it adds it to the prompt queue. If a static prompt also exists, the webhook prompt is merged into the prompt queue first, followed by the static prompt.
  
      - If the webhook response contains a transition, it does so now. If not, the scene continues to the slot filling stage.

  2. Conditions - Conditions lets you check session, user, or slot data for a condition to be true. For example, you can check to see if all slots are filled and set that as a criteria to transition to another scene to process the slots.

	- The Assistant runtime evaluates each condition in the order specified. The first condition that evaluates to true executes the associated handler and stops conditions evaluation.

        - A condition else if scene.slots.status = "FINAL" is automatically added to the condition list if you do slot filling. This optional condition checks for slot filling to be complete and can trigger a webhook or add prompts to the prompt queue.

  3. Slot filling - This stage adds a slot prompt for a single, unfilled and required slot. If you don't define any slots in the scene, this stage does nothing.

       - A scene prompts for a single slot each time through its execution loop.
 
       - If any slots are missing, the scene's lifecycle eventually loops back to the slot filling stage and prompts for the next required slot. This stage can define transition criteria to exit the execution loop.

        - The Assistant runtime selects the first unfilled slot and adds the corresponding prompt to the prompt queue. Because the scene's execution loops, additional, unfilled slots are handled later when the execution loop returns to this stage.

        - The current, active slot can have error handling prompts that override the ones defined in the scene's input stage.

        - When the user fills a slot, you can validate it in a web service by triggering a webhook.

    4. Prompts - Assistant delivers the prompt queue to the user and clears the queue. The prompt queue is the merged collection of prompts that were aggregated since the last time this stage cleared the queue.

    5. Input - Assistant consumes and returns user input to your scene to be processed which might include intent matching (global intents or user intents within a scene), continuing slot filling (if it isn't complete), or handling no match or no input errors. Can define transition criteria to exit the execution loop. If it doesn't transition, the execution loop returns to the conditions stage.

		The Assistant runtime tries to match the input to an intent or a slot:

           - In the case of a user intent match, the scene executes the associated intent handler. A scene's intent handler takes precedence over any global intents. If you didn't define a transition, the scene execution loops back the conditions stage.

           - In the case of a slot match, the scene returns to the slot filling stage.

           - In the case of a system intent match (for example, no input or no match), you can add prompts to the prompt queue, trigger a webhook, or transition.
  
	In the event of multiple no match prompts defined, the Assistant runtime chooses the most relevant, in the following order: slot filling, scene, then global no match prompts. Consecutive no matches generate a corresponding event:

	no_match_1
	no_match_2
	no_match_final

	Each level of no match (slot filling, scene, and global) can trigger webhook events. By default, the third and final no match ends the conversation.

* [**Transition**](https://developers.google.com/assistant/conversational/scenes#transition_and_exits) - When a scene meets criteria that you define, such as matching an intent or completing slot filling, you can transition to another scene to carry out even more logic. Alternatively, you can transition to the **End conversation** system scene, which ends the conversation with the user.
*
