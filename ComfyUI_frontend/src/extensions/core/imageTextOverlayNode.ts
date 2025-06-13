import { LGraphNode, LiteGraph } from '@comfyorg/litegraph'
import { app } from '@/scripts/app'
import { ComfyNodeDefImpl } from '@/stores/nodeDefStore'

// Define the custom node for text overlay
class ImageTextOverlayNode extends LGraphNode {
  // @ts-ignore
  static comfyClass = "ImageTextOverlay"
  // @ts-ignore
  static title = "Image Text Overlay"
  // @ts-ignore
  static category = "Image Utils"

  public code: string; // Declare the code property

  constructor(title?: string) {
    super(title || "Image Text Overlay") // Provide a default title
    this.addInput("image", "IMAGE")
    this.addInput("text", "STRING")
    this.addOutput("image", "IMAGE")
    this.size = [300, 120]

    // This is the code that will be edited by the "Edit Code" feature
    this.code = `
// This function overlays text onto an image.
// You can modify this code to change how text is rendered.
function overlayText(image, text) {
  // In a real scenario, this would involve canvas manipulation or a backend call.
  // For now, let's just log the inputs as a placeholder.
  console.log('Overlaying text:', text, 'on image:', image);
  return image; // Return the original image for now
}

// Example usage (this part is internal to the node and not directly editable via the UI)
// The node's logic would call overlayText internally.
// let resultImage = overlayText(inputs.image, inputs.text);
// outputs.image = resultImage;
`
  }

  // You can add additional methods for the node's logic here
  // For a real implementation, you would need to handle image processing
  // which typically involves a backend or a Canvas API.
  // This example focuses on providing the 'code' property for testing.

  // Example of a dummy execution logic
  override onExecute() {
    // In a real node, you would get inputs and process them
    // For this example, we just simulate the operation
    const image = this.getInputData(0);
    const text = this.getInputData(1);

    if (image && text) {
      console.log(`Processing Image Text Overlay: Image=${image}, Text=${text}`);
      // In a real scenario, call the 'code' function (e.g., eval(this.code))
      // and pass the image and text to it.
      // For now, we'll just output the original image.
      this.setOutputData(0, image);
    } else {
      // If no image or text, do not set output to avoid type errors
      // The output will simply remain at its previous state or default
    }
  }
}

// Register the custom node
app.registerExtension({
  name: "Comfy.ImageTextOverlayNode",
  async beforeRegisterNodeDef(nodeType, nodeData, appInstance) {
    if (nodeData.name === ImageTextOverlayNode.comfyClass) {
      // Optionally, you can modify nodeData here before registration
      // For example, adding custom widgets or properties.
    }
  },
  async registerCustomNodes() {
    LiteGraph.registerNodeType(ImageTextOverlayNode.comfyClass, ImageTextOverlayNode);
  }
}) 