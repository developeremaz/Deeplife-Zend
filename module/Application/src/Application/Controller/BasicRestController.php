<?php

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractRestfulController;
use Zend\View\Model\JsonModel;
use Zend\Validator\ValidatorChain;
use DoctrineModule\Validator\ObjectExists;

// A basic restful controller used to encapsulate repeated data
class BasicRestController extends AbstractRestfulController
{
    // Entity manager
    protected $em;

    // Entity used to fetch data
    protected $entity;

    // Max results
    protected $maxResults = 1000;

    // Cache time
    protected $cacheTime = 3600;

    // Select fields
    protected $selectFields = 'id';

    // Join fields
    protected $joinFields = array();

    // Returned index
    protected $index;

    protected function getEntityManager() {
        if (null === $this->em)
            $this->em = $this->getServiceLocator()->get('doctrine.entitymanager.orm_default');
        return $this->em;
    }

    /**
     * Validators
     */
    protected function getIdValidator() {
        $chain = new ValidatorChain();
        $chain->attach(new ObjectExists(array('object_repository' => $this->getEntityManager()->getRepository($this->entity),
          'fields' => 'id')));
        return $chain;
    }

    protected function invalidateCache() {
        // Drop cache for all objects because we don't want relations to have old data
        $config = $this->getEntityManager()->getConfiguration();
        $cacheDriver = $config->getResultCacheImpl();
        return $cacheDriver->deleteAll();
    }

    protected function triggerEvent($event, array $params) {
        $eventManager = $this->getEventManager();
        $eventManager->addIdentifiers(array(get_called_class()));
        $eventManager->trigger($event, null, $params);
    }

    public function getList()
    {
        $array = array();
        $em = $this->getEntityManager();
        $next = $this->params()->fromQuery('next');

        if(!isset($next)) {
            $query = $em->createQuery("SELECT COUNT(e.id) FROM {$this->entity} e");
            $count = $query->getSingleScalarResult();
            $array['count'] = $count;
            $next = -1;
        }

        $joinFieldsStr = '';
        $joinTablesStr = '';
        $joinIndex = 0;
        foreach($this->joinFields as $key=>$value) {
            $joinIndexStr = "j$joinIndex";
            $joinTablesStr .= " LEFT JOIN e.$key $joinIndexStr";
            $joinFieldsStr .= ", partial $joinIndexStr.{{$value}}";
            $joinIndex++;
        }

        $query = $em->createQuery("select partial e.{{$this->selectFields}}$joinFieldsStr from {$this->entity} e$joinTablesStr")
                        ->setFirstResult($next+1)
                        ->setMaxResults($this->maxResults)
                        ->useResultCache(true, $this->cacheTime, "{$this->entity}_$next");
        $objects = $query->getArrayResult();

        foreach($objects as $objectKey=>$object) {
            foreach($object as $fieldKey=>$field) {
                if($field instanceof \DateTime) {
                    $objects[$objectKey][$fieldKey] = $field->format('Y-m-d');
                }
            }
        }

        $array[$this->index] = $objects;

        return new JsonModel(
            $array
        );
    }

    public function get($id)
    {
        $object = $this->getEntityManager()->find($this->entity, $id);

        // Object doesn't exist, output 404
        if(null === $object) {
            $this->getResponse()->setStatusCode(404);
            return new JsonModel();
        }

        return new JsonModel(
            $object->toArray()
        );
    }

    public function create($data)
    {
        $request = $this->getRequest();
        if(!$request->isPost()) {
            $this->getResponse()->setStatusCode(500)->setReasonPhrase("Missing parameter.");
            return new JsonModel();
        }

        $em = $this->getEntityManager();

        // Validate using the form
        $form = $this->getServiceLocator()->get('EntityForm')->getForm($this->entity);
        $form->setData($data);
        if(!$form->isValid()) {
            $this->getResponse()->setStatusCode(500);
            return new JsonModel(array('messages' => $form->getMessages()));
        }

        // Get linked object
        $object = $form->getData();

        // Save to DB
        $em->persist($object);
        $em->flush();

        // Invalidate cache
        $this->invalidateCache();

        return new JsonModel($object->toArray());
    }

    public function update($id, $data)
    {
        // Validate that we have a correctly formed ajax request
        if(!$this->getIdValidator()->isValid($id, array('id' => $id))) {
            $this->getResponse()->setStatusCode(500)->setReasonPhrase("Invalid id provided.");
            return new JsonModel();
        }

        // Unset the id in post since we have it in variable already
        unset($data['id']);

        $em = $this->getEntityManager();
        $object = $em->find($this->entity, $id);

        foreach($data as $attribute=>$value) {
            // Sanitize input

            // Set the value
            $method = 'set' . ucfirst($attribute);
            if(is_callable(array($object, $method))) {
                $object->$method($value);
            }
        }

        // Update only passed information
        $em->flush();

        // Invalidate cache
        $this->invalidateCache();

        return new JsonModel($object->toArray());
    }

    public function delete($id)
    {
        if(!$this->getIdValidator()->isValid($id)) {
            $this->getResponse()->setStatusCode(404);
            return new JsonModel();
        }

        // Action
        $em = $this->getEntityManager();
        $object = $em->find($this->entity, $id);
        $em->remove($object);
        $em->flush();

        // Invalidate cache
        $this->invalidateCache();

        return new JsonModel(array('data' => 'OK'));
    }
}
