DELIMITER //

CREATE PROCEDURE ValidateReports(
	IN id VARCHAR(20),
	OUT status VARCHAR(20),
	)
	BEGIN

		DECLARE total_reports INT DEFAULT 0;

		SELECT count(*) INTO total_reports FROM reports_item_list
		WHERE deleted IS null
		AND report_id = id;

		IF total_reports >= 16
			SET status = false;
		ELSEIF total_reports < 16
			SET status = true;
		END IF;

	END //
DELIMITER ; 