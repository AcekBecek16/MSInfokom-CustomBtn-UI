import { LightningElement, api, wire } from 'lwc';
import { gql, graphql,refreshGraphQL } from "lightning/uiGraphQLApi";
import { CloseActionScreenEvent } from 'lightning/actions';
import { NavigationMixin } from "lightning/navigation";


export default class SyncOrderSAP extends NavigationMixin(LightningElement) {
    @api recordId
    headerLabel = 'Sync Order'


    handleCancel(event){
        this.dispatchEvent(new CloseActionScreenEvent())
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