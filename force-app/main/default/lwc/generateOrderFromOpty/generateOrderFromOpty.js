import { LightningElement, api, wire } from 'lwc';
import { gql, graphql,refreshGraphQL } from "lightning/uiGraphQLApi";
import { CloseActionScreenEvent } from 'lightning/actions';
import { NavigationMixin } from "lightning/navigation";

export default class GenerateOrderFromOpty extends NavigationMixin(LightningElement) {
    @api recordId

    headerLabel = 'Confirmation Order'
    SPK = '00000'
    orderName = 'Dummy Order Name'
    ProjectBudget = 9999999
    flowName = ''
    renderFlow;
    

    @wire(graphql, {
      query: gql`
        query singleOpportunity(
            $OpportunityId: ID
        ){
            uiapi{
                query{
                    Opportunity(
                        where:{
                            Id:{
                                eq:$OpportunityId
                            }
                        }
                    ){
                        edges{
                            node{
                                Id
                                Name{
                                    value
                                }
                                Amount_Service__c{
                                    displayValue
                                    value
                                }
                                Amount_Maintenance__c{
                                    displayValue
                                    value
                                }
                                Amount{
                                    displayValue
                                    value
                                }
                                SPK__c{
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
        this.records = data.uiapi.query.Opportunity.edges.map((edge) => edge.node);
        this.SPK = this.records[0].SPK__c.value
        this.orderName = this.records[0].Name.value
        this.ProjectBudget = this.records[0].Amount.displayValue

      }
      this.errors = errors;
    }
    
    get variables() {
      return {
        OpportunityId: this.recordId,
      };
    }



    handleCancel(event){
        this.dispatchEvent(new CloseActionScreenEvent())
    }

    handleSave(event){
        this.flowName = 'Copy_Opportunity_to_Order'
        
        this.renderFlow = true

        console.log('Flow Name '+this.flowName)
    }

    statusFlowChange(event){
        
        console.log('Output Variables ',event.detail.outputVariables);
        
        if (event.detail.status === "FINISHED_SCREEN") {
            const outputVariables = event.detail.outputVariables;
            for (let i = 0; i < outputVariables.length; i++) {
              const outputVar = outputVariables[i];
              if (outputVar.name === "setOrderID_Output") {
                console.log('output variables ', outputVar.value)
                this.navigateToRecord(outputVar.value);
              }
            }
            console.log('Input Variables ', JSON.stringify(this.flowVariables))
            this.flowName = ''
            this.renderFlow = false
            this.dispatchEvent(new CloseActionScreenEvent())
        }else{
            console.log('Flow execution encountered an unexpected status.');
        }
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

    get flowVariables(){
        return [
            {
                name: 'getOpportunityID',
                type: 'String',
                value: this.recordId
            }
        ]
    }
}