import { Button, ButtonGroup, Flex } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  function handlePageChange(page: number) {
    onPageChange(page);
  }
  return (
    <Flex justify="center" mt={4}>
      <ButtonGroup isAttached variant="outline" spacing={0}>
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          isDisabled={isFirstPage}
          leftIcon={<ChevronLeftIcon />}
        >
          Previous
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
          <Button
            key={page}
            onClick={() => handlePageChange(page)}
            variant={currentPage === page ? "solid" : "outline"}
            colorScheme={currentPage === page ? "blue" : "gray"}
          >
            {page + 1}
          </Button>
        ))}
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          isDisabled={isLastPage}
          rightIcon={<ChevronRightIcon />}
        >
          Next
        </Button>
      </ButtonGroup>
    </Flex>
  );
}

export default TablePagination;
