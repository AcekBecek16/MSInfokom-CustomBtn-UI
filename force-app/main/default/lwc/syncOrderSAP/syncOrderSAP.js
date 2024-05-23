import { LightningElement, api, wire } from 'lwc';
import { gql, graphql,refreshGraphQL } from "lightning/uiGraphQLApi";
import { CloseActionScreenEvent } from 'lightning/actions';
import { NavigationMixin } from "lightning/navigation";


export default class SyncOrderSAP extends NavigationMixin(LightningElement) {
    @api recordId
}