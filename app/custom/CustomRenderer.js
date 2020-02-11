import BaseRenderer from '../../node_modules/diagram-js/lib/draw/BaseRenderer';

import {
  append as svgAppend,
  attr as svgAttr,
  classes as svgClasses,
  create as svgCreate
} from 'tiny-svg';

import {
  getRoundRectPath
} from 'bpmn-js/lib/draw/BpmnRenderUtil';

import {
  is,
  getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';

import { isNil } from 'min-dash';

const HIGH_PRIORITY = 1500,
      TASK_BORDER_RADIUS = 2,
      COLOR_GREEN = '#52B415',
      COLOR_YELLOW = '#ffc800',
      COLOR_RED = '#cc0000';


export default class CustomRenderer extends BaseRenderer {
  constructor(eventBus, bpmnRenderer) {
    super(eventBus, HIGH_PRIORITY);

    this.bpmnRenderer = bpmnRenderer;
  }

  canRender(element) {

    // ignore labels
    return !element.labelTarget;
  }

  drawShape(parentNode, element) {
    if (element.type === 'bpmn:Task') {
      element.height = 36;
      element.width = 120;
    }
    const shape = this.bpmnRenderer.drawShape(parentNode, element);
    console.log(element);

    const skill = this.getSkillType(element);

    if (!!skill) {
      const {back, border} = this.getSkillColor(skill);
      svgAttr(shape, {
        stroke: border,
        fill: back,
        rx: 4,
        ry: 4,
      });

      var text = svgCreate('text'); 

      svgAttr(text, {
        fill: border,
        transform: 'translate(25, 23)'
      });

      svgClasses(text).add('djs-label'); 
    
      svgAppend(text, document.createTextNode(skill.replace(/^\w/, c => c.toUpperCase()))); 
    
      svgAppend(parentNode, text);
    

      return shape;
    }

    const suitabilityScore = this.getSuitabilityScore(element);


    if (!isNil(suitabilityScore)) {
      const color = this.getColor(suitabilityScore);

      const rect = drawRect(parentNode, 50, 20, TASK_BORDER_RADIUS, color);
  
      svgAttr(rect, {
        transform: 'translate(-20, -10)'
      });

      var text = svgCreate('text'); 

      svgAttr(text, {
        fill: '#fff',
        transform: 'translate(-15, 5)'
      });

      svgClasses(text).add('djs-label'); 
    
      svgAppend(text, document.createTextNode(suitabilityScore)); 
    
      svgAppend(parentNode, text);
    }

    return shape;
  }

  getShapePath(shape) {
    if (is(shape, 'bpmn:Task')) {
      return getRoundRectPath(shape, TASK_BORDER_RADIUS);
    }

    return this.bpmnRenderer.getShapePath(shape);
  }

  getSuitabilityScore(element) {
    const businessObject = getBusinessObject(element);
  
    const { suitable } = businessObject;

    return Number.isFinite(suitable) ? suitable : null;
  }

  getSkillType(element) {
    const businessObject = getBusinessObject(element);
    const { skill } = businessObject;
    return skill;
  }

  getColor(suitabilityScore) {
    if (suitabilityScore > 75) {
      return COLOR_GREEN;
    } else if (suitabilityScore > 25) {
      return COLOR_YELLOW;
    }

    return COLOR_RED;
  }

  getSkillColor(skill) {
    switch (skill) {
      case 'document':
        return {back: 'rgba(51, 12, 156, 0.2)', border: 'rgb(51, 12, 156)'};
      case 'classification':
        return {back: 'rgba(216, 116, 22, 0.2)', border: 'rgb(216, 116, 22)'};
      case 'processing':
        return {back: 'rgba(23, 189, 153, 0.2)', border: 'rgb(23, 189, 153)'};
      default:
        return {back: 'rgba(117, 117, 117, 0.2)', border: 'rgb(117, 117, 117)'};
    }
  }
}

CustomRenderer.$inject = [ 'eventBus', 'bpmnRenderer' ];

// helpers //////////

// copied from https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js
function drawRect(parentNode, width, height, borderRadius, color, stroke) {
  const rect = svgCreate('rect');

  svgAttr(rect, {
    width: width,
    height: height,
    rx: borderRadius,
    ry: borderRadius,
    stroke: stroke || color,
    strokeWidth: 2,
    fill: color
  });

  svgAppend(parentNode, rect);

  return rect;
}