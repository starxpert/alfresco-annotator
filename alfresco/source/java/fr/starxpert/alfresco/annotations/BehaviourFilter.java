/**
 * 
 */
package fr.starxpert.alfresco.annotations;

import org.alfresco.repo.jscript.BaseScopableProcessorExtension;
import org.alfresco.repo.jscript.ScriptNode;
import org.alfresco.service.ServiceRegistry;
import org.alfresco.service.namespace.QName;


/**
 * @author unknow
 *
 */
public class BehaviourFilter extends BaseScopableProcessorExtension {

	private org.alfresco.repo.policy.BehaviourFilter behaviourFilter;
	private ServiceRegistry services;

	/**
	 * Disable behaviour for specific node
	 * <p>
	 * The change applies <b>ONLY</b> to the current transaction.
	 * 
	 * @param node
	 *            the node to disable for
	 * @param qname
	 *            the type/aspect behaviour to disable
	 */
	public void disableBehaviour(ScriptNode node, String qname) {
		QName _qname = createQName(qname);

		this.behaviourFilter.disableBehaviour(node.getNodeRef(), _qname);
	}

	/**
	 * Enable behaviour for specific node
	 * <p>
	 * The change applies <b>ONLY</b> to the current transaction.
	 * 
	 * @param node
	 *            the node to enable for
	 * @param qname
	 *            the type/aspect behaviour to enable
	 */
	public void enableBehaviour(ScriptNode node, String qname) {
		QName _qname = createQName(qname);

		this.behaviourFilter.enableBehaviour(node.getNodeRef(), _qname);
	}

	/**
	 * Determine if behaviour is enabled for specific node.
	 * <p>
	 * Note: A node behaviour is enabled only when: a) the behaviour is not
	 * disabled across all nodes b) the behaviour is not disabled specifically
	 * for the provided node
	 * <p>
	 * The change applies <b>ONLY</b> to the current transaction.
	 * 
	 * @param node
	 *            the node to test for
	 * @param qname
	 *            the behaviour to test for
	 * @return true => behaviour is enabled
	 */
	public boolean isEnabled(ScriptNode node, String qname) {
		QName _qname = createQName(qname);
		return this.behaviourFilter.isEnabled(node.getNodeRef(), _qname);
	}

	/**
	 * Creates a {@link QName} object from String
	 * 
	 * @param s
	 *            the String that represents a QName
	 * @return the associated QName
	 */
	private QName createQName(String s) {
		QName qname;
		if (s.indexOf(QName.NAMESPACE_BEGIN) != -1) {
			qname = QName.createQName(s);
		} else {
			qname = QName.createQName(s, this.services.getNamespaceService());
		}
		return qname;
	}

	/**
	 * @param behaviourFilter
	 *            the behaviourFilter to set
	 */
	public void setBehaviourFilter(org.alfresco.repo.policy.BehaviourFilter behaviourFilter) {
		this.behaviourFilter = behaviourFilter;
	}

	/**
	 * @param services
	 *            the services to set
	 */
	public void setServiceRegistry(ServiceRegistry services) {
		this.services = services;
	}

}
