import { LightningElement, api, wire } from 'lwc';
import { gql, graphql,refreshGraphQL } from "lightning/uiGraphQLApi";
import { CloseActionScreenEvent } from 'lightning/actions';
import { NavigationMixin } from "lightning/navigation";

export default class GenerateProject_ServiceContract extends NavigationMixin(LightningElement) {
    
    @api recordId
    spkNumber = '12345'
    headerLabel = 'Create Project/Service Contract'
    orderType
    accountName
    orderName
    productCategory
    btnProject = 'Create Project'
    btnServiceContract = 'Create Service Contract'
    projectGenerated = false
    flowName
    ProjectId
    SeviceContractId
    
    @wire(graphql, {
      query: gql`
        query singleOrder(
            $OrderId : ID
        ){
            uiapi{
                query{
                    Order(
                        where:{
                            Id:{
                                eq:$OrderId
                            }
                        }
                    ){
                        edges{
                            node{
                                Id
                                SPK__c{
                                    value
                                }
                                Account{
                                    Name{
                                        value
                                    }
                                }
                                Opportunity{
                                    Name{
                                        value
                                    }
                                }
                                Type{
                                    value
                                }
                                Product_Category__c{
                                    value
                                }
                                Status{
                                    value
                                }
                                Project_Generated__c{
                                    value
                                }
                                Service_Generated__c{
                                    value
                                }
                            }
                        }
                    }
                }
            }
            uiapi{
                query{
                    Project__c(
                        where:{
                            Order__c:{
                                eq:$OrderId
                            }
                        }
                    ){
                        edges{
                            node{
                                Id
                                SPK__c{
                                    value
                                }
                                Name{
                                    value
                                }
                            }
                        }
                    }
                }
            }
        }
      `,
      variables: "$variables", // Use a getter function to make the variables reactive
    })
    graphqlQueryResult({ data, errors }) {
      if (data) {
        this.records = data.uiapi.query.Order.edges.map((edge) => edge.node);
        this.projectRecords = data.uiapi.query.Project__c.edges.map((edge) => edge.node)

        this.spkNumber = this.records[0].SPK__c.value
        this.headerLabel = 'Create Project/Service Contact '+this.spkNumber
        this.productCategory = this.records[0].Product_Category__c.value
        this.orderName = this.records[0].Opportunity.Name.value
        this.accountName = this.records[0].Account.Name.value
        this.orderType = this.records[0].Type.value
        this.projectGenerated = this.records[0].Project_Generated__c.value

        if(this.projectRecords.length > 0)this.ProjectId = this.projectRecords[0].Id

        if(this.projectGenerated)this.btnProject = 'View Project'
        if(this.records[0].Service_Generated__c.value)this.btnServiceContract = 'View Service Contract'

      }
      this.errors = errors;
    }
    
    get variables() {
      return {
        OrderId: this.recordId,
      };
    }

    handleCancel(event){
        this.dispatchEvent(new CloseActionScreenEvent())
    }

    handleProject(event){
        if(this.projectGenerated){
            this.navigateToRecord(this.ProjectId);
        }else{
            this.flowName = 'Order_to_Project'
            this.renderFlow = true
        }
        // console.log('record id ', this.recordId)
    }

    handleStatusChange(event){

        if (event.detail.status === "FINISHED_SCREEN") {
            const outputVariables = event.detail.outputVariables;
            for (let i = 0; i < outputVariables.length; i++) {
              const outputVar = outputVariables[i];
              if (outputVar.name === "outputRecordID") {
                // console.log('output variables ', outputVar.value)
                this.navigateToRecord(outputVar.value);
              }
            }
            // console.log('Input Variables ', JSON.stringify(this.inputVariables))
            this.flowName = ''
            this.renderFlow = false
            this.dispatchEvent(new CloseActionScreenEvent())
        }else{
            console.log('Flow execution encountered an unexpected status.');
        }

    }

    get inputVariables(){
        return [
            {
                name: 'getOrderRecordID',
                type: 'String',
                value: this.recordId
            }
        ]
    }

    navigateToRecord(recordId) {
        this[NavigationMixin.Navigate]({
          type: "standard__recordPage",
          attributes: {
            recordId,
            actionName: "view",
          },
        });
    }

}