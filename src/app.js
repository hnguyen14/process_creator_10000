import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";

import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "@bpmn-io/properties-panel/assets/properties-panel.css";

import "./style.less";

import $ from "jquery";
import BpmnModeler from "bpmn-js/lib/Modeler";

import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  CamundaPlatformPropertiesProviderModule,
} from "bpmn-js-properties-panel";

import CamundaModdle from "camunda-bpmn-moddle/resources/camunda.json";

import diagramXML from "../resources/newDiagram.bpmn";

var container = $("#js-drop-zone");

var canvas = $("#js-canvas");

var bpmnModeler = new BpmnModeler({
  container: canvas,
  propertiesPanel: {
    parent: "#js-properties-panel",
  },
  additionalModules: [
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
    CamundaPlatformPropertiesProviderModule,
  ],
  moddleExtensions: {
    camunda: CamundaModdle,
  },
});

function createNewProcess() {
  openDiagram(diagramXML);
}

function loadProcess() {
  showOpenFilePicker()
    .then((files) => {
      return files[0].getFile();
    })
    .then((file) => {
      const reader = new FileReader();

      reader.onload = function (e) {
        openDiagram(e.target.result);
      };
      reader.readAsText(file);
    });
}

async function deployProcess() {
  try {
    const { xml } = await bpmnModeler.saveXML({ format: false });
    const options = {
      method: "POST",
      body: xml,
      headers: {
        Authorization: "Bearer SANDTOKEN_test",
        "Content-Type": "application/xml",
        "X-Coupa-Customer-FQDN": "pizzadehut.coupadev.com",
        "X-Coupa-Customer-Id": "pizza-de-hut-007",
      },
    };
    fetch("http://localhost:8080/api/v1/processes", options).then(
      (response) => {
        alert("Deployed");
        console.log(response);
      }
    );
  } catch (err) {
    alert(`Failed to deploy because of err: ${err.message}`);
  }
}

async function openDiagram(xml) {
  try {
    await bpmnModeler.importXML(xml);

    container.removeClass("with-error").addClass("with-diagram");
  } catch (err) {
    container.removeClass("with-diagram").addClass("with-error");

    container.find(".error pre").text(err.message);

    console.error(err);
  }
}

$(function () {
  $("#js-create-process").click(function (e) {
    e.stopPropagation();
    e.preventDefault();

    createNewProcess();
  });

  $("#js-load-process").click(function (e) {
    e.stopPropagation();
    e.preventDefault();

    loadProcess();
  });

  $("#js-deploy-process").click(function (e) {
    e.stopPropagation();
    e.preventDefault();
    console.log("-----here");
    deployProcess();
  });
});
