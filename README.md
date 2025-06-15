This is a version of the ComfyUI-frontend I made with a built in code editor, my initial goal was to help people edit nodes behavers with out leaving ComfyUI 
or create node easier in ComfyUI and to help demystify what nodes are and what they do by dynamically pulling up the code for new users. 
Currently most code changes were made in the node context menu adding the option to edit the nodes code, and I made a CodeEditor.vue to run the code editor. 
The code editor I setup to only work with exposed code in custom nodes, so people don't brake core nodes in ComfyUI. 
If you do what to try and edit the Built in K sampler for example, currently you would need to make a custom node copy of it and edit that.

![image](https://github.com/user-attachments/assets/a5e026d9-9c11-45f5-8553-97fa0a446b56) 
![image](https://github.com/user-attachments/assets/649a1f49-da31-4c69-81c3-b0aea4bfc192)


Here is a list of features and changes I am currently trying to prioritise and make a plan of attack.

-go from codemirror to a custom fork of VScode for ComfyUI

-show code that connects to the opened node if not all the nodes code is used in one place. / full code access if ComfyUI frontend is running. 

-add support for local and API AI coding assistance 

-ComfyUI Agents (each agent will have different rules, MCPs, file access, web documentation access, orchestrators and more)
	
   -coding agent = focused on helping people code the ComfyUI frontend.
	 
   -custom node creator agent = simplified custom node creation process. 
  
   -workflow agent = has access to the custom node manager to install nodes it needs and can help users make workflows. 
