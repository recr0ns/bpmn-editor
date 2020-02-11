import BpmnModeler from 'bpmn-js/lib/Modeler';

import customControlsModule from './custom';

import diagramXML from '../resources/diagram.bpmn';

const containerEl = document.getElementById('container');

// create modeler
const bpmnModeler = new BpmnModeler({
  container: containerEl,
  additionalModules: [
    customControlsModule
  ]
});


const button = document.createElement('button');
button.innerHTML = "Do Something";
button.addEventListener('click', () => {
  bpmnModeler.saveXML({ format: true }, function (err, xml) {
    console.log(xml);
    // here xml is the bpmn format 
  });
});

document.getElementsByTagName("body")[0].appendChild(button);
// import XML
bpmnModeler.importXML(diagramXML, (err) => {
  if (err) {
    console.error(err);
  }
});
