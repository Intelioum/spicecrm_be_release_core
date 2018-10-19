<?php
namespace SpiceCRM\modules\Mailboxes\processors;

class LeadProcessor extends Processor
{
    private $lead;

    public function createLead() {
        $this->lead = \BeanFactory::newBean('Leads');

        $this->lead->save();
        $this->email->assignBeanToEmail($this->lead->id, 'Leads');
    }
}