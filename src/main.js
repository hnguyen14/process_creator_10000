const bpmnModeler = new BpmnModeler({
    container: '#canvas',
    propertiesPanel: {
        parent: '#properties'
    },
});

function newProcess() {
    const baseXML = `
        <?xml version="1.0" encoding="UTF-8"?>
        <bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn">
          <bpmn2:process id="Process_1" isExecutable="false">
            <bpmn2:startEvent id="StartEvent_1"/>
          </bpmn2:process>
          <bpmndi:BPMNDiagram id="BPMNDiagram_1">
            <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
              <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
                <dc:Bounds height="36.0" width="36.0" x="412.0" y="240.0"/>
              </bpmndi:BPMNShape>
            </bpmndi:BPMNPlane>
          </bpmndi:BPMNDiagram>
        </bpmn2:definitions>
   `;
   return loadDiagram(baseXML);
}
function loadDiagram(xml) {
    return bpmnModeler.importXML(xml)
}

function loadProcess() {
    showOpenFilePicker()
        .then((files) => {
            return files[0].getFile()
        })
        .then((file) => {
            const reader = new FileReader();

            reader.onload = function (e) {
                loadDiagram(e.target.result);
            }
            reader.readAsText(file);
        })
}

function deployProcess() {
    bpmnModeler.saveXML({ format: false }, (err, xml) => {
        console.log(xml);
        const options = {
            method: 'POST',
            body: xml,
            headers: {
                'Authorization': 'Bearer SANDTOKEN_test',
                'Content-Type': 'application/xml',
                'X-Coupa-Customer-FQDN': 'pizzadehut.coupadev.com',
                'X-Coupa-Customer-Id': 'pizza-de-hut-007',
            }
        }
        fetch('http://localhost:8080/api/v1/processes', options)
            .then((response) => {
                alert('Deployed');
                console.log(response);
            })
    })
}
