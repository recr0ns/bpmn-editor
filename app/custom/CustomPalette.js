const SUITABILITY_SCORE_HIGH = 100,
      SUITABILITY_SCORE_AVERGE = 50,
      SUITABILITY_SCORE_LOW = 25;

export default class CustomPalette {
  constructor(bpmnFactory, create, elementFactory, palette, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }

  getPaletteEntries(element) {
    const {
      bpmnFactory,
      create,
      elementFactory,
      translate
    } = this;

    function createTask(suitabilityScore) {
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:Task');
  
        businessObject.suitable = suitabilityScore;
  
        const shape = elementFactory.createShape({
          type: 'bpmn:Task',
          businessObject: businessObject
        });
  
        create.start(event, shape); 
      }
    }

    return {
      'create.service-input': {
        group: 'services',
        element: '<div class="input-service">Input</div>',
        title: translate('Service input'),
        action: {
          dragstart: createTask(SUITABILITY_SCORE_LOW),
          click: createTask(SUITABILITY_SCORE_LOW)
        }
      },
      'create.service-output': {
        group: 'services',
        element: '<div class="output-service">Output</div>',
        title: translate('Service output'),
        action: {
          dragstart: createTask(SUITABILITY_SCORE_HIGH),
          click: createTask(SUITABILITY_SCORE_HIGH)
        }
      },
      'create.service-other': {
        group: 'services',
        element: '<div class="other-service">Other service</div>',
        title: translate('Create other service'),
        action: {
          dragstart: createTask(SUITABILITY_SCORE_HIGH),
          click: createTask(SUITABILITY_SCORE_HIGH)
        }
      },
      'create.document-skill': {
        group: 'skills',
        element: '<div class="document-preview">Document</div>',
        title: translate('Document skill'),
        action: {
          dragstart: createTask(SUITABILITY_SCORE_AVERGE),
          click: createTask(SUITABILITY_SCORE_AVERGE)
        }
      },
      'create.classification-task': {
        group: 'skills',
        element: '<div class="classification-preview">Classification</div>',
        title: translate('Classification skill'),
        action: {
          dragstart: createTask(SUITABILITY_SCORE_AVERGE),
          click: createTask(SUITABILITY_SCORE_AVERGE)
        }
      },
      'create.processing-task': {
        group: 'skills',
        element: '<div class="processing-preview">Processing</div>',
        title: translate('Processing skill'),
        action: {
          dragstart: createTask(SUITABILITY_SCORE_AVERGE),
          click: createTask(SUITABILITY_SCORE_AVERGE)
        }
      },
      'create.if-case': {
        group: 'other',
        groupName: 'other items',
        element: '<div class="preview">If</div>',
        title: translate('If'),
        action: {
          dragstart: createTask(SUITABILITY_SCORE_AVERGE),
          click: createTask(SUITABILITY_SCORE_AVERGE)
        }
      },
      'create.manual-case': {
        group: 'other',
        groupName: 'other items',
        element: '<div class="preview">Manual review</div>',
        title: translate('If'),
        action: {
          dragstart: createTask(SUITABILITY_SCORE_AVERGE),
          click: createTask(SUITABILITY_SCORE_AVERGE)
        }
      },
      'create.test-case': {
        group: 'other',
        groupName: 'other items',
        element: '<div class="preview">Test workflow</div>',
        title: translate('If'),
        action: {
          dragstart: createTask(SUITABILITY_SCORE_AVERGE),
          click: createTask(SUITABILITY_SCORE_AVERGE)
        }
      },
    }
  }
}

CustomPalette.$inject = [
  'bpmnFactory',
  'create',
  'elementFactory',
  'palette',
  'translate'
];