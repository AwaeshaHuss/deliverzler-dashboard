export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  public readonly context: SecurityRuleContext;

  constructor(context: SecurityRuleContext) {
    const prettyContext = JSON.stringify(
      {
        operation: context.operation,
        path: context.path,
        data: context.requestResourceData,
      },
      null,
      2
    );

    const message = `The following request was denied by Firestore security rules:\n${prettyContext}`;

    super(message);
    this.name = 'FirestorePermissionError';
    this.context = context;

    // This is necessary for transitioning to a new Error type.
    Object.setPrototypeOf(this, FirestorePermissionError.prototype);
  }
}
