import { LightningElement, api, wire } from 'lwc';
import { gql, graphql,refreshGraphQL } from "lightning/uiGraphQLApi";
import { CloseActionScreenEvent } from 'lightning/actions';
import { NavigationMixin } from "lightning/navigation";

export default class GenerateProject_ServiceContract extends NavigationMixin(LightningElement) {
    
    recordId
    spkNumber = '12345'
    
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
        this.records = data.uiapi.query.sObjectName.edges.map((edge) => edge.node);

        this.spkNumber = this.records[0].SPK__c.value
      }
      this.errors = errors;
    }
    
    get variables() {
      return {
        OrderId: this.recordId,
      };
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