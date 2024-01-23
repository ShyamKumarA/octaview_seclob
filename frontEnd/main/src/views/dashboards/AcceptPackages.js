import { Row, Col } from 'reactstrap';
import SalesOverview from '../../components/dashboard/minimalDashboard/SalesOverview';


const AcceptPackages = () => {
  return (
    <>
      {/*********************Sales Overview ************************/}
      <Row>
        <Col lg="12">
          <SalesOverview />
        </Col>
      </Row>
      
    </>
  );
};

export default AcceptPackages;
