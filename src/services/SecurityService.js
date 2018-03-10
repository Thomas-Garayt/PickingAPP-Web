// @flow

import LoginStore from 'stores/LoginStore';

/**
 * Service to use the security context of the user.
 */
class SecurityService {

    /**
     * Check if the user is allowed to access a resource with an access level.
     * @param {string} resource The resource to check. (see constants/Resource.js)
     * @param {number} accessLevel The access level. (see constants/AccessLevel.js)
     * @returns {boolean} TRUE if the user is allowed, else FALSE.
     */
    isGranted(resource: string, accessLevel: number): boolean {
        const securityContext: ?Object = LoginStore.getSecurityContext();
        return !!securityContext && (securityContext[resource] & accessLevel)!==0;
    }
}

export default new SecurityService();
