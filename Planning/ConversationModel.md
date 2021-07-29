# Conversation Model

Invocations:

"Hey Checklist bot" ->

"Hey Checklist bot, begin action dishes" -> Action: BeginTask

"Hey Checklist bot, end action dishes" -> Action:
EndTask

# Actions

## Begin Task

### Invocation

"Begin task dishes"
"Hey Checklist bot, Begin task lawn moving"
"Hey Checklist bot, begin task dishes"

### Conversation

#### Intents

- BeginTask
  - Global Intent?: Yes

  - Training Phrases:
    - "Begin action lawn mowing"
    - "Begin action dishes"
    - "Begin task work"

  - Parameters:
    - Task

#### Types

- Task
  - Words and Synonyms:
    - "Action"
    - "Task"
    - "Work Item"
  
  - Enable Fuzzy Matching?
    - False

  - Regular Expressions?
    - False
  
  - Free form text?
    - False

  - Runtime Type Overrides

#### Scenes

#### Scene_BeginTask

##### Invocation
- "Hey Checklist bot, begin task dishes"


##### Lifecycle behavior

- OnEnter
  - Any previously matched intents? No

- Conditions
  - None

- Slot Filling
  - Task
    - If filled, invoke webhook


- Prompts

- Input
  - User Intent matches:
	- BeginTask
	  - Transition: Yes


### Fullfillment

## End Task

Begin
