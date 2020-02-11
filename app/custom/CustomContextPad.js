const SUITABILITY_SCORE_HIGH = 100,
      SUITABILITY_SCORE_AVERGE = 50,
      SUITABILITY_SCORE_LOW = 25;

export default class CustomContextPad {
  constructor(bpmnFactory, config, contextPad, create, elementFactory, injector, translate, modeling, connect) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;
    this.modeling = modeling;
    this.connect = connect;
    console.log(modeling);

    if (config.autoPlace !== false) {
      this.autoPlace = injector.get('autoPlace', false);
    }

    contextPad.registerProvider(this);
  }

  getContextPadEntries(element) {
    const {
      autoPlace,
      bpmnFactory,
      create,
      elementFactory,
      translate,
      modeling,
      connect
    } = this;
    console.log(this);

    function appendServiceTask(skill) {
      return function(event, element) {
        if (autoPlace) {
          const businessObject = bpmnFactory.create('bpmn:Task');
    
          businessObject.skill = skill;
    
          const shape = elementFactory.createShape({
            type: 'bpmn:Task',
            businessObject: businessObject
          });
    
          autoPlace.append(element, shape);
        } else {
          appendServiceTaskStart(event, element);
        }
      }
    }

    function removeElementTask(event, element) {
      modeling.removeElements([element]);
    }

    function connectElementTask(event, element) {
      connect.start(event, element);
    }

    function appendServiceTaskStart(skill) {
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:Task');

        businessObject.skill = skill;

        const shape = elementFactory.createShape({
          type: 'bpmn:Task',
          businessObject: businessObject
        });

        create.start(event, shape, element);
      }
    }

    function getItem(type, skill) {
      return {
        group: 'next',
        groupName: 'next item',
        element: `<div class="context-item ${type}"></div>`,
        title: translate('Append Task with low suitability score'),
        action: {
          click: appendServiceTask(skill),
          dragstart: appendServiceTaskStart(skill)
        }
      }
    }

    return {
      'append.output-service': getItem('context-output'),
      'append.other-service': getItem('context-other'),
      'append.document-skill': getItem('context-document', 'document'),
      'append.classification-skill': getItem('context-classification', 'classification'),
      'append.processing-skill': getItem('context-processing', 'processing'),
      'append.manual-skill': getItem('context-manual'),
      'append.if-skill': getItem('context-if'),
      'append.connect-action': {
        group: 'actions',
        element: '<div class="context-item context-remove"><svg xmlns="http://www.w3.org/2000/svg" style="transform: rotate(90deg)" viewBox="0 0 512 512"><path fill="#f76363" d="M441.4 180.5L256 0 70.6 180.5l50.4 49 99.7-97.8V512h70.6V131.7l99.7 97.8z"/></svg></div>',
        title: translate('Connect'),
        action: {
          click: connectElementTask,
          dragstart: connectElementTask
        }
      },
      'append.delete-action': {
        group: 'actions',
        element: '<div class="context-item context-remove"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 384"><path d="M64 341.3a42.8 42.8 0 0042.7 42.7h170.6a42.8 42.8 0 0042.7-42.7v-256H64v256zm52.6-151.9l30.2-30.1 45.2 45.2 45.2-45.2 30.2 30.1-45.2 45.3 45.2 45.2-30.2 30.2-45.2-45.2-45.2 45.2-30.2-30.2 45.2-45.2-45.2-45.3zM266.7 21.3L245.3 0H138.7l-21.4 21.3H42.7V64h298.6V21.3z"/></svg></div>',
        title: translate('Remove'),
        action: {
          click: removeElementTask
        }
      }
    };
  }
}

CustomContextPad.$inject = [
  'bpmnFactory',
  'config',
  'contextPad',
  'create',
  'elementFactory',
  'injector',
  'translate',
  'modeling',
  'connect'
];