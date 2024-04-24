import { LightningElement, api, wire } from 'lwc';
import { gql, graphql,refreshGraphQL } from "lightning/uiGraphQLApi";

export default class GenerateOrderFromOpty extends LightningElement {
    @api recordId

    headerLabel = 'Confirmation Order'
    SPK = '00000'
    orderName = 'Dummy Order Name'
    ProjectBudget = 9999999

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

    }
}