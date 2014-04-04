<?php

namespace SamUser\Controller;

use Zend\Mvc\Controller\AbstractActionController;

use SamUser\Entity\User;
use SamUser\Entity\Role;

class UsersController extends AbstractActionController {

    protected $em;

    protected function getEntityManager() {
        if (null === $this->em)
            $this->em = $this->getServiceLocator()->get('doctrine.entitymanager.orm_default');
        return $this->em;
    }

    protected function filterParent($var) {
        return !$var->getParent();
    }

    protected function filterChild($var) {
        return $var->getParent();
    }

    /**
     * User list / default action
     */
    public function indexAction() {
        // TODO: We need support for deeper children
        $roles = $this->getEntityManager()->getRepository('SamUser\Entity\Role')->findAll();
        $parents = array_filter($roles, array($this, "filterParent"));
        $childs = array_filter($roles, array($this, "filterChild"));

        $createForm = $this->getServiceLocator()->get('EntityForm')->getForm('SamUser\Entity\User', 'create()');

        return array(
            'rolesParent' => $parents,
            'rolesChild' => $childs,
            'form' => $createForm,
        );
    }

    /**
     * User details
     */
    public function detailsAction() {
        // TODO: We need support for deeper children
        $roles = $this->getEntityManager()->getRepository('SamUser\Entity\Role')->findAll();
        $parents = array_filter($roles, array($this, "filterParent"));
        $childs = array_filter($roles, array($this, "filterChild"));

        return array(
            'rolesParent' => $parents,
            'rolesChild' => $childs,
        );
    }
}
